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
    const fileName = `image_${fileHash}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Eğer dosya zaten varsa, yeni dosya oluşturma
    if (existsSync(filePath)) {
      const imageUrl = `/uploads/${fileName}`;
      return NextResponse.json({
        success: true,
        url: imageUrl,
        fileName: fileName,
        cached: true,
      });
    }

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
