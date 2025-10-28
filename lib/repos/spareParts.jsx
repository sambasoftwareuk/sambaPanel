// lib/repos/spare-parts.js
import { q } from "@/lib/db";
import { buildCollectionUrl } from "@/lib/routes";

const PUB = `i.status='published' AND (i.publish_at IS NULL OR i.publish_at<=NOW())`;
const PUBC = `c.status='published' AND (c.publish_at IS NULL OR c.publish_at<=NOW())`;

export async function getAllSparePart(locale, type = "spare") {
  const rows = await q(
    `SELECT
       i.id,
       il.slug,
       il.title,
       m.url AS hero_url,
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
     LEFT JOIN media m
       ON m.id = pim.media_id
     WHERE i.type = :type
       AND i.status = 'published'
       AND (i.publish_at IS NULL OR i.publish_at <= NOW())
     ORDER BY i.sort_order, il.title`,
    { locale, type }
  );

  return rows.map((r) => ({
    ...r,
    href: `/yedek-parcalar/${r.slug}`,
  }));
}

export async function getSparePartBySlug(slug, locale, type = "spare") {
  const item = await q(
    `SELECT 
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
         AND i.type = :type
         AND i.status='published' AND (i.publish_at IS NULL OR i.publish_at <= NOW())
       LIMIT 1`,
    { slug, locale, type }
  ).then((r) => r[0]);

  if (!item) return null;

  const media = await q(
    `SELECT
          m.id,
          m.url,
          m.alt_text,
          im.caption,
          im.sort_order
       FROM item_media im
       JOIN media m ON m.id = im.media_id
       WHERE im.item_id = :id
       ORDER BY im.sort_order, im.id`,
    { id: item.id }
  );

  return {
    ...item,
    media,
    hero_url: media[0]?.url || null,
    hero_alt: media[0]?.alt_text || item.title,
  };
}
