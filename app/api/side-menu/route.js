export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { q, tx } from "@/lib/db";

export async function PATCH(request) {
  const { userId, sessionId } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const body = await request.json();
  const { side_menu, locale = "tr-TR" } = body;

  if (!side_menu || !Array.isArray(side_menu)) {
    return NextResponse.json(
      { ok: false, error: "Invalid side_menu data" },
      { status: 400 }
    );
  }

  try {
    await tx(async (conn) => {
      // Her section için side_menu_lists tablosunu güncelle
      for (const section of side_menu) {
        if (section.title && section.menu_key) {
          await conn.execute(
            `UPDATE side_menu_lists 
             SET title_override = ? 
             WHERE menu_key = ? AND locale = ?`,
            [section.title, section.menu_key, locale]
          );
        }
      }
    });

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("SideMenu update error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
