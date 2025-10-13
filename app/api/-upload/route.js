import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { createHash } from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image"); // Her iki form field'ını da destekle

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Sadece resim dosyaları kabul edilir" },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan büyük olamaz" },
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
          return NextResponse.json({
            success: true,
            url: imageUrl,
            fileName: existingFile,
            cached: true,
          });
        }
      } catch (e) {
        // Dosya okunamazsa devam et
        continue;
      }
    }

    // Sıralı numaralandırma için sayaç bul
    const sambaImageFiles = existingFiles.filter((f) =>
      f.startsWith("sambaImage")
    );
    const counter = sambaImageFiles.length + 1;

    const fileName = `sambaImage${counter
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
