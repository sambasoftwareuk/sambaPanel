// app/api/corporate/route.js
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { q, tx } from "@/lib/db";

// --- küçük yardımcılar ---
const PUB = `p.status='published' AND (p.publish_at IS NULL OR p.publish_at<=NOW())`;

function ok(data, init = 200) {
  return NextResponse.json(data, { status: init });
}
function bad(message, code = 400) {
  return NextResponse.json({ error: message }, { status: code });
}
function requireAdmin(req) {
  const need = process.env.ADMIN_TOKEN;
  if (!need) return true; // admin token tanımlı değilse serbest (dev)
  const got = req.headers.get("x-admin-token");
  return need && got && got === need;
}

/** GET /api/corporate?locale=tr-TR
 *  Dönen örnek:
 *  {
 *    id, hero_media_id, side_menu_key, status, publish_at,
 *    locale: "tr-TR",
 *    slug, title, body_html,
 *    seo: { meta_title, meta_description, og_title, og_description, json_ld }
 *  }
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "tr-TR";

  // Kurumsal sayfanın canonical slug'ı: 'corporate'
  const page = await q(
    `SELECT p.id, p.hero_media_id, p.side_menu_key, p.status, p.publish_at,
            pl.locale, pl.slug, pl.title, pl.body_html,
            pl.meta_title, pl.meta_description, pl.og_title, pl.og_description, pl.json_ld
     FROM pages p
     JOIN page_locales pl ON pl.page_id=p.id AND pl.locale=:locale
     WHERE p.slug='corporate' AND ${PUB}
     LIMIT 1`,
    { locale }
  ).then(r => r[0]);

  if (!page) {
    // published yoksa draft da döndürebilmek için ikinci şans
    const any = await q(
      `SELECT p.id, p.hero_media_id, p.side_menu_key, p.status, p.publish_at,
              pl.locale, pl.slug, pl.title, pl.body_html,
              pl.meta_title, pl.meta_description, pl.og_title, pl.og_description, pl.json_ld
       FROM pages p
       JOIN page_locales pl ON pl.page_id=p.id AND pl.locale=:locale
       WHERE p.slug='corporate'
       LIMIT 1`,
      { locale }
    ).then(r => r[0]);
    if (!any) return bad("Corporate page not found", 404);
    return ok(shape(any));
  }

  return ok(shape(page));

  function shape(r) {
    return {
      id: r.id,
      hero_media_id: r.hero_media_id,
      side_menu_key: r.side_menu_key,
      status: r.status,
      publish_at: r.publish_at,
      locale: r.locale,
      slug: r.slug,
      title: r.title,
      body_html: r.body_html,
      seo: {
        meta_title: r.meta_title,
        meta_description: r.meta_description,
        og_title: r.og_title,
        og_description: r.og_description,
        json_ld: r.json_ld,
      },
    };
  }
}

/** PUT /api/corporate
 *  Header: x-admin-token: <ADMIN_TOKEN>
 *  Body örneği:
 *  {
 *    "hero_media_id": 1,                // null olabilir
 *    "side_menu_key": "corporate",     // null olabilir (menüsüz)
 *    "status": "published",            // draft|scheduled|published|archived
 *    "publish_at": "2025-10-11 12:00:00", // null olabilir
 *    "locales": {
 *      "tr-TR": {
 *        "slug": "kurumsal",
 *        "title": "Kurumsal",
 *        "body_html": "<p>...</p>",
 *        "meta_title": "KURUMSAL — GreenStep",
 *        "meta_description": "Hijyenik soğutma kuleleri",
 *        "og_title": "KURUMSAL — GreenStep",
 *        "og_description": "Hijyenik çözümler",
 *        "json_ld": "{ \"@type\":\"Organization\" }"
 *      },
 *      "en-US": {
 *        "slug": "about-us",
 *        "title": "About Us",
 *        "body_html": "<p>...</p>",
 *        "meta_title": "About — GreenStep",
 *        "meta_description": "Hygienic cooling towers",
 *        "og_title": "About — GreenStep",
 *        "og_description": "Eco solutions",
 *        "json_ld": "{ \"@type\":\"Organization\" }"
 *      }
 *    }
 *  }
 */
export async function PUT(req) {
  if (!requireAdmin(req)) return bad("Unauthorized", 401);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const {
    hero_media_id = null,
    side_menu_key = null,
    status = "draft",
    publish_at = null,
    locales = {},
  } = payload || {};

  // Temel doğrulamalar
  const validStatus = new Set(["draft", "scheduled", "published", "archived"]);
  if (!validStatus.has(status)) return bad("Invalid status");

  const localeKeys = Object.keys(locales);
  if (localeKeys.length === 0) return bad("At least one locale is required");

  // body_html sanitize
  for (const loc of localeKeys) {
    if (locales[loc]?.body_html) {
      locales[loc].body_html = sanitizeHtml(locales[loc].body_html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "figure", "figcaption"]),
        allowedAttributes: {
          a: ["href", "name", "target", "rel"],
          img: ["src", "alt", "width", "height", "loading"],
          "*": ["style", "class"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel", "data"],
      });
    }
  }

  try {
    const result = await tx(async (conn) => {
      // 1) sayfa var mı?
      const [existing] = await conn.query(
        `SELECT id FROM pages WHERE slug='corporate' LIMIT 1`
      );
      let pageId;
      if (existing.length) {
        pageId = existing[0].id;
        await conn.query(
          `UPDATE pages
           SET hero_media_id = ?,
               side_menu_key = ?,
               status = ?,
               publish_at = ?
           WHERE id = ?`,
          [hero_media_id, side_menu_key, status, publish_at, pageId]
        );
      } else {
        const [ins] = await conn.query(
          `INSERT INTO pages (slug, hero_media_id, side_menu_key, status, publish_at)
           VALUES ('corporate', ?, ?, ?, ?)`,
          [hero_media_id, side_menu_key, status, publish_at]
        );
        pageId = ins.insertId;
      }

      // 2) locale slug çakışması kontrolü (aynı locale+slug başka sayfada kullanılıyor mu?)
      for (const loc of localeKeys) {
        const { slug } = locales[loc] || {};
        if (!slug) throw new Error(`Missing slug for locale ${loc}`);
        const [dup] = await conn.query(
          `SELECT pl.page_id
             FROM page_locales pl
            WHERE pl.locale = ? AND pl.slug = ? AND pl.page_id <> ? 
            LIMIT 1`,
          [loc, slug, pageId]
        );
        if (dup.length) {
          const err = new Error(`Slug '${slug}' already used in locale ${loc}`);
          err.status = 409;
          throw err;
        }
      }

      // 3) upsert page_locales
      for (const loc of localeKeys) {
        const L = locales[loc];
        const row = [
          pageId, loc, L.slug, L.title ?? null, L.body_html ?? null,
          L.meta_title ?? null, L.meta_description ?? null,
          L.og_title ?? null, L.og_description ?? null, L.json_ld ?? null,
        ];

        // (page_id, locale) unique → ON DUPLICATE KEY
        await conn.query(
          `INSERT INTO page_locales
           (page_id, locale, slug, title, body_html, meta_title, meta_description, og_title, og_description, json_ld)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             slug=VALUES(slug),
             title=VALUES(title),
             body_html=VALUES(body_html),
             meta_title=VALUES(meta_title),
             meta_description=VALUES(meta_description),
             og_title=VALUES(og_title),
             og_description=VALUES(og_description),
             json_ld=VALUES(json_ld)`,
          row
        );
      }

      // 4) güncel TR çıktısını döndür (yoksa ilk verilen locale)
      const prefer = localeKeys.includes("tr-TR") ? "tr-TR" : localeKeys[0];
      const [out] = await conn.query(
        `SELECT p.id, p.hero_media_id, p.side_menu_key, p.status, p.publish_at,
                pl.locale, pl.slug, pl.title, pl.body_html,
                pl.meta_title, pl.meta_description, pl.og_title, pl.og_description, pl.json_ld
         FROM pages p
         JOIN page_locales pl ON pl.page_id=p.id AND pl.locale=?
         WHERE p.id=? LIMIT 1`,
        [prefer, pageId]
      );

      return out[0];
    });

    return ok({
      message: "Corporate page saved",
      page: {
        id: result.id,
        hero_media_id: result.hero_media_id,
        side_menu_key: result.side_menu_key,
        status: result.status,
        publish_at: result.publish_at,
        locale: result.locale,
        slug: result.slug,
        title: result.title,
        body_html: result.body_html,
        seo: {
          meta_title: result.meta_title,
          meta_description: result.meta_description,
          og_title: result.og_title,
          og_description: result.og_description,
          json_ld: result.json_ld,
        },
      },
    });
  } catch (e) {
    const code = e.status || 500;
    return bad(e.message || "Server error", code);
  }
}
