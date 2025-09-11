import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, alt_text } = body;

    if (!url) {
      return NextResponse.json({ error: "URL gerekli" }, { status: 400 });
    }

    const result = await q(
      `
      INSERT INTO media (url, alt_text, created_at)
      VALUES (?, ?, NOW())
    `,
      [url, alt_text || null]
    );

    return NextResponse.json({
      id: result.insertId,
      url,
      alt_text,
    });
  } catch (e) {
    console.error("Media creation error:", e);
    return NextResponse.json(
      { error: "Media oluşturulamadı" },
      { status: 500 }
    );
  }
}
