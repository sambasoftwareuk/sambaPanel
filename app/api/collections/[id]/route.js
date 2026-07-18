import { NextResponse } from "next/server";
import { tx } from "@/lib/db";
import { isRouteAuthorized } from "@/lib/auth";

function bad(message, code = 400) { return NextResponse.json({ error: message }, { status: code }); }

export async function PATCH(req, { params }) {
  if (!isRouteAuthorized(req)) return bad("Unauthorized", 401);
  const { id } = await params;
  let body;
  try { body = await req.json(); } catch { return bad("Invalid JSON"); }
  const { title, hero_media_id, locale = "tr-TR" } = body || {};

  try {
    const item = await tx(async (conn) => {
      if (title !== undefined) {
        await conn.query(`UPDATE collection_locales SET title = ? WHERE collection_id = ? AND locale = ?`, [title, id, locale]);
      }
      if (hero_media_id !== undefined) {
        await conn.query(`UPDATE collections SET hero_media_id = ? WHERE id = ?`, [hero_media_id, id]);
      }
      const [rows] = await conn.query(
        `SELECT c.id, cl.slug, cl.title, m.url AS hero_url, m.alt_text AS hero_alt FROM collections c JOIN collection_locales cl ON cl.collection_id = c.id AND cl.locale = ? LEFT JOIN media m ON m.id = c.hero_media_id WHERE c.id = ? LIMIT 1`,
        [locale, id]
      );
      if (!rows.length) { const err = new Error("Collection not found"); err.status = 404; throw err; }
      return rows[0];
    });
    return NextResponse.json({ message: "Collection updated", item });
  } catch (e) { console.error(e); return bad(e.message || "Server error", e.status || 500); }
}

export async function DELETE(req, { params }) {
  if (!isRouteAuthorized(req)) return bad("Unauthorized", 401);
  const { id } = await params;
  try {
    await tx(async (conn) => {
      await conn.query(`UPDATE collections SET status = ? WHERE id = ?`, ["archived", id]);
    });
    return NextResponse.json({ message: "Collection deleted" });
  } catch (e) { console.error(e); return bad(e.message || "Server error", 500); }
}
