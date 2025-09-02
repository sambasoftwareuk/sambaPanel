export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createPage } from "@/lib/repos/page";

// CREATE - Yeni sayfa oluştur
export async function POST(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const body = await request.json();
    const { title, content, locale = "tr-TR", slug } = body;

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Başlık gerekli" },
        { status: 400 }
      );
    }

    // Repository'deki create fonksiyonunu kullan
    const newPage = await createPage({
      title,
      content_html: content,
      locale,
      slug,
      status: "draft",
    });

    return NextResponse.json({ ok: true, data: newPage });
  } catch (error) {
    console.error("Page create error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
