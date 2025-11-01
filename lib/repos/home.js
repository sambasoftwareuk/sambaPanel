// lib/repos/home.js
import { q } from "@/lib/db";
import {
  buildItemUrl,
  buildCollectionUrl,
  buildBlogPostUrl,
} from "@/lib/routes";
import { formatTurkishDate } from "@/lib/utils/dateFormat";

export async function getHomeData(locale, { latestBlog = 6 } = {}) {
  const slider = await q(
    `SELECT hsi.id, m.url, m.alt_text, hsil.title, hsil.subtitle, hsil.cta_label, hsil.cta_href
     FROM home_sliders hs
     JOIN home_slider_items hsi ON hsi.slider_id = hs.id AND hsi.is_active=1
     LEFT JOIN home_slider_item_locales hsil ON hsil.slider_item_id = hsi.id AND hsil.locale = :locale
     LEFT JOIN media m ON m.id = hsi.media_id
     WHERE hs.is_active = 1
     ORDER BY hsi.sort_order`,
    { locale }
  );

  const featuredCollections = await q(
    `SELECT c.id, cl.slug, cl.title, m.url AS hero_url, m.alt_text
     FROM home_featured_collections hfc
     JOIN collections c ON c.id = hfc.collection_id
     JOIN collection_locales cl ON cl.collection_id = c.id AND cl.locale=:locale
     LEFT JOIN media m ON m.id = c.hero_media_id
     WHERE hfc.is_active=1 AND c.status='published' AND (c.publish_at IS NULL OR c.publish_at<=NOW())
     ORDER BY hfc.sort_order`,
    { locale }
  );

  const featuredItems = await q(
    `SELECT
  i.id,
  il.slug,
  il.title,
  m.url       AS image_url,
  m.alt_text  AS image_alt
FROM home_featured_items hfi
JOIN items i
  ON i.id = hfi.item_id
JOIN item_locales il
  ON il.item_id = i.id AND il.locale = :locale
LEFT JOIN item_media im
  ON im.item_id = i.id AND im.sort_order = 1
LEFT JOIN media m
  ON m.id = im.media_id
WHERE hfi.is_active = 1
  AND i.status = 'published'
  AND (i.publish_at IS NULL OR i.publish_at <= NOW())
ORDER BY hfi.sort_order;
`,
    { locale }
  );

  const spareCarousel = await q(
    `SELECT
  i.id,
  il.slug,
  il.title,
  m.url  AS image_url,
  m.alt_text AS image_alt
FROM home_carousels hc
JOIN home_carousel_items hci
  ON hci.carousel_id = hc.id AND hci.is_active = 1
JOIN items i
  ON i.id = hci.item_id
JOIN item_locales il
  ON il.item_id = i.id AND il.locale = :locale
-- kapak görseli: item_media'da en küçük sort_order
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
WHERE hc.scope = 'spare'
  AND hc.status = 'published'
  AND (hc.publish_at IS NULL OR hc.publish_at <= NOW())
ORDER BY hci.sort_order;
`,
    { locale }
  );

  const serviceCarousel = await q(
    `SELECT
  i.id,
  il.slug,
  il.title,
  m.url      AS image_url,
  m.alt_text AS image_alt
FROM home_carousels hc
JOIN home_carousel_items hci
  ON hci.carousel_id = hc.id AND hci.is_active = 1
JOIN items i
  ON i.id = hci.item_id
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
WHERE hc.scope = 'service'
  AND hc.status = 'published'
  AND (hc.publish_at IS NULL OR hc.publish_at <= NOW())
  AND i.status = 'published'
  AND (i.publish_at IS NULL OR i.publish_at <= NOW())
ORDER BY hci.sort_order, i.sort_order, i.id DESC;
`,
    { locale }
  );

  const latestPosts = await q(
    `SELECT bp.id, bpl.slug, bpl.title, bpl.summary,
            COALESCE(bp.publish_at, bp.created_at) AS dt,
            m.url AS hero_url, m.alt_text AS hero_alt
     FROM blog_posts bp
     JOIN blog_post_locales bpl ON bpl.post_id=bp.id AND bpl.locale=:locale
     LEFT JOIN media m ON m.id = bp.hero_media_id
     WHERE bp.status='published' AND (bp.publish_at IS NULL OR bp.publish_at<=NOW())
     ORDER BY dt DESC
     LIMIT :limit`,
    { locale, limit: latestBlog }
  );

  return {
    slider,
    featuredCollections: featuredCollections.map((c) => ({
      ...c,
      href: buildCollectionUrl("product", locale, c.slug), // tip farkı varsa map’le
    })),
    featuredItems: featuredItems.map((i) => ({
      ...i,
      href: buildItemUrl("product", locale, i.slug),
    })),
    spareCarousel: spareCarousel.map((i) => ({
      ...i,
      href: buildItemUrl("spare", locale, i.slug),
    })),
    serviceCarousel: serviceCarousel.map((i) => ({
      ...i,
      href: buildItemUrl("service", locale, i.slug),
    })),
    latestPosts: latestPosts.map((p) => {
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.summary || "",
        imageLink: p.hero_url || "/generic-image.png",
        imageAlt: p.hero_alt || p.title,
        date: formatTurkishDate(p.dt),
        aspectRatio: "aspect-[16/16]",
        href: buildBlogPostUrl(locale, p.slug),
      };
    }),
  };
}
