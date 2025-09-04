// app/api/pages/[id]/route.js
import { NextResponse } from "next/server";
import { q } from "@/lib/db"; // kendi yoluna göre düzelt
export const runtime = "nodejs"; // Edge değil

export async function PATCH(req, ctx) {
  // Next.js 14/15 farkını güvenli şekilde ele al
  const paramsMaybePromise = ctx?.params;
  const params =
    typeof paramsMaybePromise?.then === "function"
      ? await paramsMaybePromise
      : paramsMaybePromise;

  const id = params?.id;
  const body = await req.json();
  const { locale, ...rest } = body;

  if (!id || !locale) {
    return NextResponse.json({ error: "id ve locale gerekli" }, { status: 400 });
  }

  // İzinli alanlar
  const allowed = ["title", "content_html", "content_json"];
  const fields = [];
  const paramsObj = { id, locale };

  for (const key of allowed) {
    if (rest[key] !== undefined) {
      fields.push(`${key} = :${key}`);
      paramsObj[key] = key === "content_json" ? JSON.stringify(rest[key]) : rest[key];
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok" }, { status: 400 });
  }

  const sql = `
    UPDATE page_locales
       SET ${fields.join(", ")}
     WHERE page_id = :id AND locale = :locale
     LIMIT 1
  `;

  try {
    const result = await q(sql, paramsObj); // OkPacket döner
    const affected = result?.affectedRows ?? 0;
    return NextResponse.json({ ok: true, affectedRows: affected });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Sunucu hatası" }, { status: 500 });
  }
}
