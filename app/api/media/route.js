import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || 20;
    const offset = searchParams.get("offset") || 0;

    const media = await q(
      `
      SELECT id, url, alt_text, created_at
      FROM media 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
      [parseInt(limit), parseInt(offset)]
    );

    return NextResponse.json({ media });
  } catch (e) {
    console.error("Gallery load error:", e);
    return NextResponse.json({ error: "Galeri yüklenemedi" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, alt_text } = body;

    if (!url) {
      return NextResponse.json({ error: "URL gerekli" }, { status: 400 });
    }

    // Önce mevcut kaydı kontrol et
    const existingMedia = await q(
      `SELECT id, url, alt_text FROM media WHERE url = ? LIMIT 1`,
      [url]
    );

    if (existingMedia.length > 0) {
      // Mevcut kayıt varsa onu döndür
      return NextResponse.json({
        id: existingMedia[0].id,
        url: existingMedia[0].url,
        alt_text: existingMedia[0].alt_text,
        existing: true,
      });
    }

    // Mevcut kayıt yoksa yeni oluştur
    const mediaId = `sambaImage${Date.now()}`;

    try {
      const result = await q(
        `INSERT INTO media (id, url, alt_text, created_at) VALUES (?, ?, ?, NOW())`,
        [mediaId, url, alt_text || null]
      );

      return NextResponse.json({
        id: mediaId,
        url,
        alt_text,
        created: true,
      });
    } catch (insertError) {
      console.error("Media INSERT hatası:", insertError);
      throw insertError;
    }
  } catch (e) {
    console.error("Media creation error:", e);
    return NextResponse.json(
      { error: "Media oluşturulamadı" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    // Önce media kaydını bul (dosya yolu için)
    const media = await q(`SELECT url FROM media WHERE id = ?`, [id]);

    if (media.length === 0) {
      return NextResponse.json({ error: "Media bulunamadı" }, { status: 404 });
    }

    // Database'den sil
    const result = await q(`DELETE FROM media WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Media silinemedi" }, { status: 500 });
    }

    // Fiziksel dosyayı sil
    try {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(process.cwd(), "public", media[0].url);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.error("Dosya silinemedi:", fileError);
      // Dosya silme hatası olsa bile database silindi, devam et
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (e) {
    console.error("Media deletion error:", e);
    return NextResponse.json({ error: "Media silinemedi" }, { status: 500 });
  }
}
