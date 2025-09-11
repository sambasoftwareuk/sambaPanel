// lib/repos/pages.js
import { q, tx } from "@/lib/db";
import sanitizeHtml from "sanitize-html";
import { makeSlug } from "@/lib/slug";

export async function getKurumsalPage(locale = "tr-TR") {
  const rows = await q(
    `
    SELECT p.id, p.slug, p.status, p.hero_media_id,
           pl.locale, pl.slug_i18n, pl.title, pl.summary, pl.content_html,
           m.url AS hero_url, m.alt_text AS hero_alt
    FROM pages p
    JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = :locale
    LEFT JOIN media m ON m.id = p.hero_media_id
    WHERE (p.slug = 'hakkimizda' OR pl.slug_i18n = 'kurumsal')
      AND p.status IN ('published','draft')
    LIMIT 1;
  `,
    { locale }
  );
  return rows[0] || null;
}

export async function updatePageLocale({ id, locale, payload }) {
  const safeHtml =
    payload.content_html !== undefined
      ? sanitizeHtml(payload.content_html || "", {
          allowedTags: [
            "p",
            "br",
            "strong",
            "em",
            "u",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "blockquote",
            "a",
            "img",
            "div",
            "span",
          ],
          allowedAttributes: {
            a: ["href", "target", "rel"],
            img: ["src", "alt", "width", "height", "style", "class"],
            div: ["style", "class"],
            span: ["style", "class"],
            p: ["style", "class"],
            h1: ["style", "class"],
            h2: ["style", "class"],
            h3: ["style", "class"],
            h4: ["style", "class"],
            h5: ["style", "class"],
            h6: ["style", "class"],
          },
          allowedSchemes: ["http", "https"],
          allowedSchemesByTag: {
            img: ["http", "https"],
          },
        })
>>>>>>> bug/editorImage
      : undefined;
  const newSlug = payload.slug_i18n
    ? makeSlug(payload.slug_i18n, locale)
    : undefined;

  await tx(async (conn) => {
    if (payload.status || payload.slug || payload.hero_media_id !== undefined) {
      await conn.execute(
        `UPDATE pages SET
           status = COALESCE(?, status),
           slug   = COALESCE(?, slug),
           hero_media_id = COALESCE(?, hero_media_id),
           published_at = CASE WHEN ?='published' THEN COALESCE(published_at, NOW()) ELSE published_at END
         WHERE id=?`,
        [
          payload.status || null,
          payload.slug || null,
          payload.hero_media_id || null,
          payload.status || null,
          id,
        ]
      );
    }

    const [exists] = await conn.execute(
      `SELECT id FROM page_locales WHERE page_id=? AND locale=? LIMIT 1`,
      [id, locale]
    );

    if (Array.isArray(exists) && exists.length) {
      await conn.execute(
        `UPDATE page_locales SET
           slug_i18n = COALESCE(?, slug_i18n),
           title = COALESCE(?, title),
           summary = COALESCE(?, summary),
           content_html = COALESCE(?, content_html),
           content_json = COALESCE(?, content_json),
           meta_title = COALESCE(?, meta_title),
           meta_description = COALESCE(?, meta_description),
           meta_robots = COALESCE(?, meta_robots)
         WHERE page_id=? AND locale=?`,
        [
          newSlug ?? null,
          payload.title ?? null,
          payload.summary ?? null,
          safeHtml ?? null,
          payload.content_json ? JSON.stringify(payload.content_json) : null,
          payload.meta_title ?? null,
          payload.meta_description ?? null,
          payload.meta_robots ?? null,
          id,
          locale,
        ]
      );
    } else {
      await conn.execute(
        `INSERT INTO page_locales (page_id, locale, slug_i18n, title, summary, content_html, content_json,
                                   meta_title, meta_description, meta_robots)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
          id,
          locale,
          newSlug || makeSlug(payload.title || "sayfa", locale),
          payload.title || "Başlık",
          payload.summary || null,
          safeHtml ?? null,
          payload.content_json ? JSON.stringify(payload.content_json) : null,
          payload.meta_title || null,
          payload.meta_description || null,
          payload.meta_robots || null,
        ]
      );
    }
  });

  return { ok: true };
}
