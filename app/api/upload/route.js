import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { createHash } from "crypto";
import { mime } from "zod/v4";
import { log } from "console";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image"); // Her iki form field'ını da destekle

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Sadece resim ve video dosyaları kabul edilir" },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (resim: 5MB, video: 50MB)
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Dosya boyutu ${file.type.startsWith("video/") ? "50MB" : "5MB"}'dan büyük olamaz` },
        { status: 400 }
      );
    }

    // Uploads klasörünü oluştur
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Dosya içeriğini oku
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya hash'i oluştur (duplicate kontrolü için)
    const fileHash = createHash("md5").update(buffer).digest("hex");
    const fileExtension = file.name.split(".").pop();

    // Mevcut dosyaları kontrol et
    const existingFiles = await import("fs").then((fs) =>
      fs.promises.readdir(uploadsDir).catch(() => [])
    );

    // Aynı hash'e sahip dosya var mı kontrol et (mevcut dosyaların içeriğini kontrol et)
    for (const existingFile of existingFiles) {
      try {
        const existingFilePath = join(uploadsDir, existingFile);
        const existingBuffer = await import("fs").then((fs) =>
          fs.promises.readFile(existingFilePath)
        );
        const existingHash = createHash("md5")
          .update(existingBuffer)
          .digest("hex");

        if (existingHash === fileHash) {
          const imageUrl = `/uploads/${existingFile}`;
          log("filetype:", file.type);
          return NextResponse.json({
            success: true,
            url: imageUrl,
            fileName: existingFile,
            cached: true,
            mime_type: file.type
          });
        }
      } catch (e) {
        // Dosya okunamazsa devam et
        continue;
      }
    }

    // Sıralı numaralandırma için sayaç bul
    const prefix = file.type.startsWith("video/") ? "sambaVideo" : "sambaImage";
    const sambaFiles = existingFiles.filter((f) =>
      f.startsWith(prefix)
    );
    const counter = sambaFiles.length + 1;

    const fileName = `${prefix}${counter
      .toString()
      .padStart(2, "0")}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Dosyayı kaydet
    await writeFile(filePath, buffer);

    // URL'i döndür
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload hatası:", error);
    return NextResponse.json(
      { error: "Resim yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
