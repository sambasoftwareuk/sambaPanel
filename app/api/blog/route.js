// app/api/blog/route.js
import { NextResponse } from "next/server";
import { q, tx } from "@/lib/db";

function ok(data, init = 200) {
  return NextResponse.json(data, { status: init });
}
function bad(message, code = 400) {
  return NextResponse.json({ error: message }, { status: code });
}
function requireAdmin(req) {
  const need = process.env.ADMIN_TOKEN;
  if (!need) return true; // dev'de serbest
  const got = req.headers.get("x-admin-token");
  return need && got && got === need;
}

/**
 * POST /api/blog
 * Body:
 * {
 *   "hero_media_id": 1,  // null olabilir
 *   "status": "published",  // draft|scheduled|published|archived
 *   "publish_at": "2025-06-29 12:00:00",  // null olabilir
 *   "locales": {
 *     "tr-TR": {
 *       "slug": "blog-slug",
 *       "title": "Blog Başlık",
 *       "summary": "Özet metin",
 *       "body_html": "<p>İçerik...</p>"
 *     }
 *   }
 * }
 */
export async function POST(req) {
  if (!requireAdmin(req)) return bad("Unauthorized", 401);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const {
    hero_media_id = null,
    status = "published",
    publish_at = null,
    locales = {},
  } = payload || {};

  const validStatus = new Set(["draft", "scheduled", "published", "archived"]);
  if (!validStatus.has(status)) return bad("Invalid status");

  const localeKeys = Object.keys(locales);
  if (localeKeys.length === 0) return bad("At least one locale is required");

  try {
    const out = await tx(async (conn) => {
      // Blog post ekle
      const [ins] = await conn.query(
        `INSERT INTO blog_posts (hero_media_id, status, publish_at) VALUES (?, ?, ?)`,
        [hero_media_id, status, publish_at]
      );
      const postId = ins.insertId;

      // Locale kayıtları ekle
      for (const locale of localeKeys) {
        const loc = locales[locale];
        await conn.query(
          `INSERT INTO blog_post_locales (post_id, locale, slug, title, summary, body_html)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            postId,
            locale,
            loc.slug,
            loc.title,
            loc.summary || null,
            loc.body_html || null,
          ]
        );
      }

      // Döndür
      const [row] = await conn.query(
        `SELECT bp.id, bp.status, bp.publish_at, bpl.locale, bpl.slug, bpl.title
         FROM blog_posts bp
         JOIN blog_post_locales bpl ON bpl.post_id = bp.id
         WHERE bp.id = ? LIMIT 1`,
        [postId]
      );
      return row[0];
    });

    return ok({ message: "blog post created", post: out }, 201);
  } catch (e) {
    console.error("Blog creation error:", e);
    return bad(e.message || "Server error", 500);
  }
}
