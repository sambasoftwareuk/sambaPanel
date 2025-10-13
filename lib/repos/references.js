// lib/repos/references.js
import { q } from '@/lib/db';

export async function getReferences() {
  return q(
    `SELECT rc.company_name, rc.link_url, m.url AS logo_url, m.alt_text
     FROM references_companies rc
     JOIN media m ON m.id=rc.logo_media_id
     WHERE rc.status='published' AND (rc.publish_at IS NULL OR rc.publish_at<=NOW())
     ORDER BY rc.sort_order, rc.id`
  );
}
