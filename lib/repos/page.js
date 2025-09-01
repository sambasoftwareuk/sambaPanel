// lib/repos/pages.js
import { q, tx } from '@/lib/db';
import sanitizeHtml from 'sanitize-html';
import { makeSlug } from '@/lib/slug';

export async function getKurumsalPage(locale = 'tr-TR') {
  const rows = await q(`
    SELECT p.id, p.slug, p.status,
           pl.locale, pl.slug_i18n, pl.title, pl.summary, pl.content_html,
           m.url AS hero_url, m.alt_text AS hero_alt
    FROM pages p
    JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = :locale
    LEFT JOIN media m ON m.id = p.hero_media_id
    WHERE (p.slug = 'hakkimizda' OR pl.slug_i18n = 'kurumsal')
      AND p.status IN ('published','draft')
    LIMIT 1;
  `, { locale });
  return rows[0] || null;
}

export async function updatePageLocale({ id, locale, payload }) {
  const safeHtml = payload.content_html !== undefined
    ? sanitizeHtml(payload.content_html || '')
    : undefined;
  const newSlug = payload.slug_i18n ? makeSlug(payload.slug_i18n, locale) : undefined;

  await tx(async (conn) => {
    if (payload.status || payload.slug) {
      await conn.execute(
        `UPDATE pages SET
           status = COALESCE(?, status),
           slug   = COALESCE(?, slug),
           published_at = CASE WHEN ?='published' THEN COALESCE(published_at, NOW()) ELSE published_at END
         WHERE id=?`,
        [payload.status || null, payload.slug || null, payload.status || null, id]
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
           meta_title = COALESCE(?, meta_title),
           meta_description = COALESCE(?, meta_description),
           meta_robots = COALESCE(?, meta_robots)
         WHERE page_id=? AND locale=?`,
        [
          newSlug ?? null,
          payload.title ?? null,
          payload.summary ?? null,
          safeHtml ?? null,
          payload.meta_title ?? null,
          payload.meta_description ?? null,
          payload.meta_robots ?? null,
          id, locale
        ]
      );
    } else {
      await conn.execute(
        `INSERT INTO page_locales (page_id, locale, slug_i18n, title, summary, content_html,
                                   meta_title, meta_description, meta_robots)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          id, locale, newSlug || makeSlug(payload.title || 'sayfa', locale),
          payload.title || 'Başlık',
          payload.summary || null,
          safeHtml ?? null,
          payload.meta_title || null,
          payload.meta_description || null,
          payload.meta_robots || null
        ]
      );
    }
  });

  return { ok: true };
}
