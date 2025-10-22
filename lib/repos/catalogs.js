// lib/repos/catalogs.js
import { q } from '@/lib/db';

export async function getCatalogs(locale) {
  return q(
    `SELECT c.id, cl.slug, cl.title, cl.summary, m.url AS pdf_url
     FROM catalogs c
     JOIN catalog_locales cl ON cl.catalog_id=c.id AND cl.locale=:locale
     JOIN media m ON m.id=c.pdf_media_id
     WHERE c.status='published' AND (c.publish_at IS NULL OR c.publish_at<=NOW())
     ORDER BY c.sort_order, c.id`,
    { locale }
  );
}
