import { NextResponse } from "next/server";
import { tx } from "@/lib/db";
import { isRouteAuthorized } from "@/lib/auth";
import { makeSlug } from "@/lib/slug";
import { buildCollectionUrl } from "@/lib/routes";

function bad(message, code = 400) { return NextResponse.json({ error: message }, { status: code }); }

export async function POST(req) {
  if (!isRouteAuthorized(req)) return bad("Unauthorized", 401);
  let body;
  try { body = await req.json(); } catch { return bad("Invalid JSON"); }
  const { title = "Yeni Ürün Kartı", locale = "tr-TR", type = "product", hero_media_id = null } = body || {};
  const baseSlug = makeSlug(title, locale) || "yeni-urun-karti";

  try {
    const item = await tx(async (conn) => {
      const [maxRows] = await conn.query(`SELECT COALESCE(MAX(sort_order), 0) AS max_sort FROM collections WHERE type = ?`, [type]);
      const [ins] = await conn.query(
        `INSERT INTO collections (type, status, publish_at, sort_order, hero_media_id) VALUES (?, ?, NOW(), ?, ?)`,
        [type, "published", Number(maxRows[0]?.max_sort || 0) + 10, hero_media_id]
      );
      const id = ins.insertId;
      let slug = baseSlug;
      const [dupes] = await conn.query(`SELECT 1 FROM collection_locales WHERE locale = ? AND slug = ? LIMIT 1`, [locale, slug]);
      if (dupes.length) slug = `${baseSlug}-${id}`;
      await conn.query(`INSERT INTO collection_locales (collection_id, locale, slug, title) VALUES (?, ?, ?, ?)`, [id, locale, slug, title]);
      return { id, slug, title, hero_url: null, hero_alt: title, href: buildCollectionUrl(type, locale, slug) };
    });
    return NextResponse.json({ message: "Collection created", item }, { status: 201 });
  } catch (e) { console.error(e); return bad(e.message || "Server error", 500); }
}
