import metadataMap from "../mocks/meta.json";
import { q } from "@/lib/db";

export const revalidate = 3600; // 1 saat sonra metadata background’da güncellensin 🔁

const BRAND_SUFFIX = "Greenstep Su Soğutma Kuleleri";
const TITLE_PATTERN = "%s - " + BRAND_SUFFIX;
const DEFAULT_DESCRIPTION =
  "Greenstep su soğutma kuleleri ile ilgili detaylı bilgi alın.";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parsePath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const hasLocale = parts[0]?.includes("-");
  const locale = hasLocale ? parts[0] : "tr-TR";
  const segments = hasLocale ? parts.slice(1) : parts;

  const isItem = segments.length > 1;
  const slug = segments[segments.length - 1] || "greenstep";
  return { slug, isItem, locale };
}

async function fetchFromDB(slug, isItem, locale) {
  // slug veya locale yoksa DB sorgusunu atla
  if (!slug || !locale) {
    console.warn("fetchFromDB: slug veya locale undefined!", { slug, locale });
    return null;
  }

  const table = isItem ? "item_locales" : "page_locales";

  const rows = await q(
    `SELECT meta_title AS title,
            meta_description AS description
     FROM ${table}
     WHERE slug = ? AND locale = ?
     LIMIT 1`,
    [slug, locale]
  );

  return rows[0] || null;
}

export async function getMetaData(pathname) {
  const { slug, isItem, locale } = parsePath(pathname);

  const dbMeta = await fetchFromDB(slug, isItem, locale);
  const jsonMeta = metadataMap[pathname];

  const fallbackSegment = capitalize(slug);

  const title =
    dbMeta?.title ||
    jsonMeta?.title ||
    TITLE_PATTERN.replace("%s", fallbackSegment);

  const description =
    dbMeta?.description || jsonMeta?.description || DEFAULT_DESCRIPTION;

  return { title, description };
}
