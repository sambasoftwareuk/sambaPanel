export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { updatePageLocale } from "@/lib/repos/page";

// BULK UPDATE - Toplu güncelleme
export async function PATCH(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const { pages } = await request.json();

    if (!Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz sayfa listesi" },
        { status: 400 }
      );
    }

    // Her sayfayı güncelle
    for (const page of pages) {
      if (page.id && page.data) {
        await updatePageLocale({
          id: page.id,
          locale: page.locale || "tr-TR",
          payload: page.data,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// BULK DELETE - Toplu silme
export async function DELETE(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const { pageIds } = await request.json();

    if (!Array.isArray(pageIds) || pageIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz sayfa ID listesi" },
        { status: 400 }
      );
    }

    // Her sayfayı sil (repository'de delete fonksiyonu eklenmeli)
    // Şimdilik sadece response dönüyor
    console.log("Bulk delete requested for pages:", pageIds);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
