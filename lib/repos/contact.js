// lib/repos/contacts.js
import { q } from '@/lib/db';
import { buildPageUrl, root } from '@/lib/routes';

export async function getContactCards(locale) {
  const cards = await q(
    `SELECT c.id, c.map_embed_url
     FROM contact_cards c
     WHERE c.status='published' AND (c.publish_at IS NULL OR c.publish_at<=NOW())
     ORDER BY c.sort_order, c.id`
  );

  const locales = await q(
    `SELECT ccl.card_id, ccl.slug, ccl.title, ccl.address
     FROM contact_card_locales ccl
     WHERE ccl.locale=:locale`,
    { locale }
  );

  const byCard = new Map();
  for (const l of locales) {
    byCard.set(l.card_id, l);
  }

  for (const c of cards) {
    const loc = byCard.get(c.id);
    const [phones, emails, whatsapps] = await Promise.all([
      q(`SELECT label, phone FROM contact_phones WHERE card_id=:id ORDER BY sort_order, id`, { id: c.id }),
      q(`SELECT label, email FROM contact_emails WHERE card_id=:id ORDER BY sort_order, id`, { id: c.id }),
      q(`SELECT label, phone FROM contact_whatsapps WHERE card_id=:id ORDER BY sort_order, id`, { id: c.id }),
    ]);
    Object.assign(c, loc, { phones, emails, whatsapps });
    c.href = root(locale, 'contact') + '/' + loc.slug;
  }
  return cards;
}
