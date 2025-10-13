// app/api/pages/[id]/route.js
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { q, tx } from "@/lib/db";

function ok(data, status = 200) { return NextResponse.json(data, { status }); }
function bad(msg, code = 400) { return NextResponse.json({ error: msg }, { status: code }); }
function requireAdmin(req) {
  const need = process.env.ADMIN_TOKEN;
  if (!need) return true; // dev’de serbest
  const got = req.headers.get("x-admin-token");
  return need && got && got === need;
}

/**
 * PATCH /api/pages/:id
 * Body:
 * {
 *   title?: string,
 *   content_html?: string,          // body_html'e yazılır
 *   hero_media_id?: number|null,
 *   locale: "tr-TR" | "en-US",
 *   side_menu?: Array<{ title: string, menu_key?: string }>
 * }
 */
export async function PATCH(req, { params }) {
  if (!requireAdmin(req)) return bad("Unauthorized", 401);

  const pageId = Number(params.id);
  if (!pageId) return bad("Invalid page id");

  let body;
  try { body = await req.json(); } catch { return bad("Invalid JSON"); }

  const {
    title,
    content_html,
    hero_media_id,
    locale = "tr-TR",
    side_menu, // opsiyonel
  } = body || {};

  if (!locale) return bad("locale is required");

  // sanitize body_html
  const safeHtml = typeof content_html === "string"
    ? sanitizeHtml(content_html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img","h1","h2","h3","figure","figcaption"]),
        allowedAttributes: {
          a: ["href","name","target","rel"],
          img: ["src","alt","width","height","loading"],
          "*": ["style","class"],
        },
        allowedSchemes: ["http","https","mailto","tel","data"],
      })
    : undefined;

  try {
    const result = await tx(async (conn) => {
      // 1) pages hero_media_id güncelle (gelmişse)
      if (hero_media_id !== undefined) {
        await conn.query(
          `UPDATE pages SET hero_media_id = ? WHERE id = ?`,
          [hero_media_id, pageId]
        );
      }

      // 2) page_locales (title/body) upsert
      if (title !== undefined || safeHtml !== undefined) {
        // mevcut var mı?
        const [cur] = await conn.query(
          `SELECT id, title, body_html FROM page_locales WHERE page_id=? AND locale=? LIMIT 1`,
          [pageId, locale]
        );

        if (cur.length) {
          await conn.query(
            `UPDATE page_locales
               SET title = COALESCE(?, title),
                   body_html = COALESCE(?, body_html)
             WHERE page_id=? AND locale=?`,
            [title ?? null, safeHtml ?? null, pageId, locale]
          );
        } else {
          // slug’ı bilmediğimiz için yeni kayıt gerekiyorsa default slug üretelim: corporate TR/EN
          const fallbackSlug = locale === "en-US" ? "corporate" : "kurumsal";
          await conn.query(
            `INSERT INTO page_locales (page_id, locale, slug, title, body_html)
             VALUES (?, ?, ?, ?, ?)`,
            [pageId, locale, fallbackSlug, title ?? "", safeHtml ?? ""]
          );
        }
      }

      // 3) (opsiyonel) side menu başlık override’ı
      if (Array.isArray(side_menu) && side_menu.length) {
        // side_menu: [{ title, menu_key? }, ...]
        for (const section of side_menu) {
          const titleOverride = section?.title?.trim();
          const menuKey = resolveMenuKey(section?.menu_key); // boşsa corporate varsayımı
          if (!menuKey || !titleOverride) continue;

          // varsa update, yoksa insert
          await conn.query(
            `INSERT INTO side_menu_lists (menu_key, locale, default_title, title_override, is_active)
             VALUES (?, ?, ?, ?, 1)
             ON DUPLICATE KEY UPDATE title_override=VALUES(title_override), is_active=1`,
            [menuKey, locale, titleOverride, titleOverride]
          );
        }
      }

      // 4) güncel TR veya verilen locale ile sayfayı döndür
      const [out] = await conn.query(
        `SELECT p.id, p.hero_media_id, p.side_menu_key, p.status, p.publish_at,
                pl.locale, pl.slug, pl.title, pl.body_html,
                m.url AS hero_url, m.alt_text AS hero_alt
           FROM pages p
           JOIN page_locales pl ON pl.page_id=p.id AND pl.locale=?
      LEFT JOIN media m ON m.id = p.hero_media_id
          WHERE p.id=? LIMIT 1`,
        [locale, pageId]
      );
      return out[0];
    });

    return ok({
      message: "Page updated",
      page: result,
    });
  } catch (e) {
    console.error(e);
    return bad(e.message || "Server error", 500);
  }
}

// basit map: component’ten gelebilecek değerleri normalize eder
function resolveMenuKey(raw) {
  if (!raw) return "corporate";
  const k = String(raw).toLowerCase();
  if (k.includes("urun")) return "products";
  if (k.includes("yedek")) return "spares";
  if (k.includes("hizmet")) return "services";
  if (k.includes("kurumsal") || k.includes("corporate")) return "corporate";
  if (k.includes("product")) return "products";
  if (k.includes("spare")) return "spares";
  if (k.includes("service")) return "services";
  return raw; // zaten doğru bir key olabilir
}
