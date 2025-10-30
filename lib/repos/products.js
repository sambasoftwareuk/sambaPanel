// lib/repos/products.js
import { q } from "@/lib/db";
import { buildCollectionUrl, buildItemUrl } from "@/lib/routes";

const PUB = `i.status='published' AND (i.publish_at IS NULL OR i.publish_at<=NOW())`;
const PUBC = `c.status='published' AND (c.publish_at IS NULL OR c.publish_at<=NOW())`;

export async function getProductCollections(locale, type = "product") {
  const rows = await q(
    `SELECT c.id, cl.slug, cl.title, 
            m.url AS hero_url, 
            m.alt_text AS hero_alt
     FROM collections c
     JOIN collection_locales cl 
          ON cl.collection_id = c.id AND cl.locale = :locale
     LEFT JOIN media m 
          ON m.id = c.hero_media_id
     WHERE c.type = :type AND ${PUBC}
     ORDER BY c.sort_order, cl.title`,
    { locale, type }
  );

  return rows.map((r) => ({
    ...r,
    href: buildCollectionUrl(type, locale, r.slug),
  }));
}

//!Bu kisim kontrol edilmeyecek.Su anda bir yerde kullanilmiyor.
export async function getItemsByCollectionSlug(
  locale,
  collectionSlug,
  type = "product"
) {
  const rows = await q(
    `SELECT i.id, il.slug, il.title
     FROM collections c
     JOIN collection_locales cl ON cl.collection_id=c.id AND cl.locale=:locale
     JOIN items i ON i.collection_id=c.id AND i.type=:type
     JOIN item_locales il ON il.item_id=i.id AND il.locale=:locale
     WHERE cl.slug=:slug AND ${PUB} AND ${PUBC}
     ORDER BY i.sort_order, il.title`,
    { locale, slug: collectionSlug, type }
  );
  return rows.map((r) => ({ ...r, href: buildItemUrl(type, locale, r.slug) }));
}

// grupsuz ürünler (collection_id IS NULL)
//!Bu kisim kontrol edilmeyecek
export async function getTopLevelItems(locale, type = "product") {
  const rows = await q(
    `SELECT i.id, il.slug, il.title
     FROM items i
     JOIN item_locales il ON il.item_id=i.id AND il.locale=:locale
     WHERE i.collection_id IS NULL AND i.type=:type AND ${PUB}
     ORDER BY i.sort_order, il.title`,
    { locale, type }
  );
  return rows.map((r) => ({ ...r, href: buildItemUrl(type, locale, r.slug) }));
}

export async function getProductBySlug(slug, locale, type = "product") {
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

export async function getOtherProductCollections(
  slug,
  locale,
  type = "product"
) {
  const rows = await q(
    `SELECT c.id, cl.slug, cl.title, 
            m.url AS hero_url, 
            m.alt_text AS hero_alt
     FROM collections c
     JOIN collection_locales cl 
          ON cl.collection_id = c.id AND cl.locale = :locale
     LEFT JOIN media m 
          ON m.id = c.hero_media_id
     WHERE c.type = :type AND ${PUBC}
     AND cl.slug!=:slug
     ORDER BY c.sort_order, cl.title`,
    { locale, type, slug }
  );

  return rows.map((r) => ({
    ...r,
    href: buildCollectionUrl(type, locale, r.slug),
  }));
}
