// app/api/media/[id]/route.js
import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function PATCH(req, ctx) {
  const params = await ctx.params;
  const id = params?.id;
  const body = await req.json();
  
  if (!id) {
    return NextResponse.json({ error: "Media ID gerekli" }, { status: 400 });
  }

  const allowed = ["url", "alt_text"];
  const fields = [];
  const paramsObj = { id };

  for (const key of allowed) {
    if (body[key] !== undefined) {
      fields.push(`${key} = :${key}`);
      paramsObj[key] = body[key];
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok" }, { status: 400 });
  }

  const sql = `
    UPDATE media
       SET ${fields.join(", ")}
     WHERE id = :id
     LIMIT 1
  `;

  try {
    const result = await q(sql, paramsObj);
    const affected = result?.affectedRows ?? 0;
    return NextResponse.json({ ok: true, affectedRows: affected });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Sunucu hatası" }, { status: 500 });
  }
}