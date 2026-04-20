import { q } from "@/lib/db";

function isNonEmpty(value) {
  return typeof value === "string" ? value.trim().length > 0 : value != null;
}

function normalizeImages(value) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return undefined;

    if (text.startsWith("[")) {
      try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }

    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
}

export async function getSeoPage(pageKey, locale = "tr-TR") {
  return q(
    `SELECT *
     FROM seo_pages
     WHERE page_key = :pageKey
       AND locale = :locale
       AND status = 'published'
     LIMIT 1`,
    { pageKey, locale }
  ).then((rows) => rows[0] || null);
}

export function buildMetadata(seoRow, fallback = {}) {
  const title = isNonEmpty(seoRow?.meta_title) ? seoRow.meta_title : fallback.title;
  const description = isNonEmpty(seoRow?.meta_description)
    ? seoRow.meta_description
    : fallback.description;
  const robots = isNonEmpty(seoRow?.meta_robots)
    ? seoRow.meta_robots
    : fallback.robots;
  const canonical = isNonEmpty(seoRow?.canonical_url)
    ? seoRow.canonical_url
    : fallback.canonical;

  const ogTitle = isNonEmpty(seoRow?.og_title) ? seoRow.og_title : (fallback.openGraph?.title || title);
  const ogDescription = isNonEmpty(seoRow?.og_description)
    ? seoRow.og_description
    : (fallback.openGraph?.description || description);

  const fallbackImages = fallback.openGraph?.images || fallback.twitter?.images;
  const images =
    normalizeImages(seoRow?.og_images) ||
    normalizeImages(seoRow?.og_image) ||
    normalizeImages(seoRow?.images) ||
    fallbackImages;

  return {
    title,
    description,
    ...(robots ? { robots } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(images ? { images } : {}),
    },
    twitter: {
      title: ogTitle,
      description: ogDescription,
      ...(images ? { images } : {}),
    },
  };
}
