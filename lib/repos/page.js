// lib/repos/pages.js
import { q, tx } from "@/lib/db";
import sanitizeHtml from "sanitize-html";
import { makeSlug } from "@/lib/slug";

export async function getKurumsalPage(locale = "tr-TR") {
  const rows = await q(
    `

    SELECT p.id, p.slug, p.status, p.hero_media_id,
           pl.locale, pl.slug_i18n, pl.title, pl.summary, pl.content_html,
           CASE 
             WHEN m.url IS NOT NULL AND m.url NOT LIKE '/%' THEN CONCAT('/', m.url)
             ELSE m.url 
           END AS hero_url, 
           m.alt_text AS hero_alt
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
//Product sorgularını repos/product.js'e taşı.
export async function getProductGroups({
  locale = "tr-TR",
  onlyHomepage = false,
} = {}) {
  const homepageFilter = onlyHomepage ? "AND g.show_on_main_page = 1" : "";
  const rows = await q(
    `
    SELECT
      g.id,
      g.slug,
      g.status,
      g.sort_order,
      g.show_on_main_page,
      g.home_sort_order,
      gl.locale,
      gl.slug_i18n,
      gl.name,
      m.url       AS hero_url,
      m.alt_text  AS hero_alt
    FROM collection g
    JOIN collection_locales gl
      ON gl.collection_id = g.id AND gl.locale = :locale
    LEFT JOIN media m
      ON m.id = g.hero_media_id
    WHERE g.status = 'published'
      ${homepageFilter}
    ORDER BY
      g.sort_order ASC,
      g.id DESC;
    `,
    { locale }
  );

  return rows;
}

export async function getSingleProduct(
  slug,
  locale = "tr-TR",
  { includeDraft = false } = {}
) {
  // 1) Ana ürün (localized)
  const productRows = await q(
    `
    SELECT
      p.id,
      p.group_id,
      p.sku,
      p.status,
      p.sort_order,
      p.hero_media_id,
      pl.locale,
      pl.slug_i18n,
      pl.name,
      pl.summary,
      pl.content_html,
      pl.content_json,
      pl.side_menu_json,
      pl.meta_title,
      pl.meta_description,
      pl.meta_robots,
      pl.og_title,
      pl.og_description,
      m.url  AS hero_url,
      m.alt_text AS hero_alt,
      og.url AS og_image_url,
      og.alt_text AS og_image_alt
    FROM products p
    JOIN product_locales pl
      ON pl.product_id = p.id AND pl.locale = :locale
    LEFT JOIN media m
      ON m.id = p.hero_media_id
    LEFT JOIN media og
      ON og.id = pl.og_image_id
    WHERE pl.slug_i18n = :slug
      AND p.status IN (${includeDraft ? "'draft','published'" : "'published'"})
    LIMIT 1;
    `,
    { slug, locale }
  );

  return productRows[0] || null;
}

//bu fonksiyon kullanılmıyor
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
      : undefined;
  const newSlug = payload.slug_i18n
    ? makeSlug(payload.slug_i18n, locale)
    : undefined;

  // Transaction içinde pages güncellemesi (foreign key constraint için)
  await tx(async (conn) => {
    // Eğer hero_media_id sambaImage ile başlıyorsa, önce media oluştur
    if (
      payload.hero_media_id &&
      typeof payload.hero_media_id === "string" &&
      payload.hero_media_id.startsWith("sambaImage")
    ) {
      // Media'nın var olup olmadığını kontrol et
      const [existingMedia] = await conn.execute(
        `SELECT id FROM media WHERE id = ? LIMIT 1`,
        [payload.hero_media_id]
      );

      if (!existingMedia || existingMedia.length === 0) {
        // Media yoksa oluştur
        await conn.execute(
          `INSERT INTO media (id, url, alt_text, created_at) VALUES (?, ?, ?, NOW())`,
          [
            payload.hero_media_id,
            payload.hero_media_url || "",
            payload.hero_media_alt || "",
          ]
        );
      }
    }

    // Pages tablosunu güncelle
    if (payload.status || payload.slug || payload.hero_media_id !== undefined) {
      await conn.execute(
        `UPDATE pages SET
           status = COALESCE(?, status),
           slug   = COALESCE(?, slug),
           hero_media_id = COALESCE(?, hero_media_id),
           publish_at = CASE WHEN ?='published' THEN COALESCE(publish_at, NOW()) ELSE publish_at END
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
  });

  await tx(async (conn) => {
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
