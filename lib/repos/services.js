// lib/repos/services.js
import { q } from "@/lib/db";
import { buildItemUrl } from "@/lib/routes";

const PUB = `i.status='published' AND (i.publish_at IS NULL OR i.publish_at <= NOW())`;

/**
 * Menüde kullanılacak "service" item'ları: id, title, slug
 */
export async function getServiceMenu(locale) {
  const rows = await q(
    `
    SELECT i.id, il.title, il.slug
    FROM items i
    JOIN item_locales il
      ON il.item_id = i.id AND il.locale = :locale
    WHERE i.type = 'service' AND ${PUB}
    ORDER BY i.sort_order, il.title
    `,
    { locale }
  );

  return rows.map((r) => ({
    ...r,
    href: buildItemUrl("service", locale, r.slug),
  }));
}

/**
 * Ana sayfa / liste kartları: service + (ilk medya url/alt)
 * "İlk medya"yı item_media.sort_order en küçük olan kayıt üzerinden seçiyoruz.
 */
export async function getServiceCards(locale) {
  const rows = await q(
    `
    SELECT
      i.id,
      il.title,
      il.slug,
      m.url      AS hero_url,
      m.alt_text AS hero_alt
    FROM items i
    JOIN item_locales il
      ON il.item_id = i.id AND il.locale = :locale
    LEFT JOIN (
      SELECT im.item_id, im.media_id
      FROM item_media im
      JOIN (
        SELECT item_id, MIN(sort_order) AS min_sort
        FROM item_media
        GROUP BY item_id
      ) x ON x.item_id = im.item_id AND x.min_sort = im.sort_order
    ) pim ON pim.item_id = i.id
    LEFT JOIN media m ON m.id = pim.media_id
    WHERE i.type = 'service' AND ${PUB}
    ORDER BY i.sort_order, il.title
    `,
    { locale }
  );

  return rows.map((r) => ({
    ...r,
    href: buildItemUrl("service", locale, r.slug),
  }));
}

/**
 * Service detay: slug ile tek kayıt + tüm medyalar
 */
export async function getServiceBySlug(slug, locale) {
  const item = await q(
    `
    SELECT
      i.id,
      i.type,
      i.collection_id,
      il.slug,
      il.title,
      il.body_html
    FROM items i
    JOIN item_locales il
      ON il.item_id = i.id AND il.locale = :locale
    WHERE il.slug = :slug
      AND i.type = 'service'
      AND ${PUB}
    LIMIT 1
    `,
    { slug, locale }
  ).then((r) => r[0]);

  if (!item) return null;

  const media = await q(
    `
    SELECT
      m.id,
      m.url,
      m.alt_text,
      im.caption,
      im.sort_order
    FROM item_media im
    JOIN media m ON m.id = im.media_id
    WHERE im.item_id = :id
    ORDER BY im.sort_order, im.id
    `,
    { id: item.id }
  );

  return {
    ...item,
    media,
    hero_url: media[0]?.url || null,
    hero_alt: media[0]?.alt_text || item.title,
  };
}

export async function getOtherServices(slug, locale) {
  const rows = await q(
    `
    SELECT 
      il.title,
      il.slug,
      m.url AS image_url
    FROM items i
    JOIN item_locales il 
      ON il.item_id = i.id AND il.locale = :locale
    LEFT JOIN item_media im 
      ON im.item_id = i.id
    LEFT JOIN media m 
      ON m.id = im.media_id
    WHERE i.type = 'service'
      AND il.slug != :slug
      AND i.status = 'published'
      AND (i.publish_at IS NULL OR i.publish_at <= NOW())
    GROUP BY i.id
    LIMIT 10
    `,
    { slug, locale }
  );

  return rows.map((r) => ({
    ...r,
    hero_url: r.image_url,
    hero_alt: r.alt_text || r.title,
    href: `/hizmetler/${r.slug}`,
  }));
}
