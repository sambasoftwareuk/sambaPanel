export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { updatePageLocale } from "@/lib/repos/page";

export async function PATCH(request, ctx) {
  const { userId, sessionId } = getAuth(request);
  console.log("PATCH getAuth =>", { userId, sessionId });

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // ✅ params senkron mu async mi? Her iki durumu da güvenle ele al
  const awaitedParams =
    typeof ctx?.params?.then === "function" ? await ctx.params : ctx.params;
  const id = Number(awaitedParams?.id);

  if (!Number.isFinite(id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid id" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const locale = body.locale || "tr-TR";

  try {
    // Repository'deki fonksiyonu kullan
    await updatePageLocale({ id, locale, payload: body });

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
