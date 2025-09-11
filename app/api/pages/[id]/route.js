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
    return NextResponse.json(
      { error: "id ve locale gerekli" },
      { status: 400 }
    );
  }

  // İzinli alanlar
  const allowed = ["title", "content_html", "content_json", "hero_media_id"];
  const pageFields = [];
  const localeFields = [];
  const paramsObj = { id, locale };

  for (const key of allowed) {
    if (rest[key] !== undefined) {
      if (key === "hero_media_id") {
        // pages tablosuna ait
        pageFields.push(`${key} = :${key}`);
        paramsObj[key] = rest[key];
      } else {
        // page_locales tablosuna ait
        localeFields.push(`${key} = :${key}`);
        paramsObj[key] =
          key === "content_json" ? JSON.stringify(rest[key]) : rest[key];
      }
    }
  }

  if (pageFields.length === 0 && localeFields.length === 0) {
    return NextResponse.json(
      { error: "Güncellenecek alan yok" },
      { status: 400 }
    );
  }

  try {
    let totalAffected = 0;

    // 1. pages tablosunu güncelle (hero_media_id)
    if (pageFields.length > 0) {
      const pageSql = `
        UPDATE pages
           SET ${pageFields.join(", ")}
         WHERE id = :id
         LIMIT 1
      `;
      const pageResult = await q(pageSql, paramsObj);
      totalAffected += pageResult?.affectedRows ?? 0;
    }

    // 2. page_locales tablosunu güncelle (title, content_html, content_json)
    if (localeFields.length > 0) {
      const localeSql = `
        UPDATE page_locales
           SET ${localeFields.join(", ")}
         WHERE page_id = :id AND locale = :locale
         LIMIT 1
      `;
      const localeResult = await q(localeSql, paramsObj);
      totalAffected += localeResult?.affectedRows ?? 0;
    }

    return NextResponse.json({ ok: true, affectedRows: totalAffected });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Sunucu hatası" },
      { status: 500 }
    );
  }
}
