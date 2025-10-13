// lib/repos/services.js
import { q, tx } from "@/lib/db";
import sanitizeHtml from "sanitize-html";
import { makeSlug } from "@/lib/slug";


export async function getServicesForListing(locale,
  { includeDraft = false, limit = 100, offset = 0 } = {}
) {
  const rows = await q(
    `
    SELECT
      s.id,
      s.sort_order,
      s.status,
      sl.name       AS title,
      sl.slug_i18n  AS slug,
      m.url         AS hero_url,
      m.alt_text    AS hero_alt
    FROM services s
    JOIN service_locales sl
      ON sl.service_id = s.id AND sl.locale = :locale
    LEFT JOIN media m
      ON m.id = s.hero_media_id
    WHERE s.status IN (${includeDraft ? "'draft','published'" : "'published'"})
    ORDER BY s.sort_order ASC, s.id DESC
    LIMIT :limit OFFSET :offset;
    `,
    { locale, limit, offset }
  );

  return rows;
}

export async function getSingleService(
  slug,
  locale = "tr-TR",
  { includeDraft = false } = {}
) {
  // 1) Ana hizmet (localized)
  const serviceRows = await q(
    `
     SELECT
      s.id, s.status, s.sort_order,
      sl.locale, sl.slug_i18n, sl.name, sl.summary,
      sl.content_html, sl.content_json, sl.side_menu_json,
      sl.meta_title, sl.meta_description, sl.meta_robots,
      sl.og_title, sl.og_description,
      hm.url  AS hero_url, hm.alt_text  AS hero_alt,
      ogm.url AS og_image_url, ogm.alt_text AS og_image_alt
    FROM services s
    JOIN service_locales sl
      ON sl.service_id = s.id AND sl.locale = :locale
    LEFT JOIN media hm ON hm.id = s.hero_media_id
    LEFT JOIN media ogm ON ogm.id = sl.og_image_id
    WHERE sl.slug_i18n = :slug
      AND s.status = 'published'
    LIMIT 1;
  `, { slug, locale });

  return serviceRows[0] || null;
}

