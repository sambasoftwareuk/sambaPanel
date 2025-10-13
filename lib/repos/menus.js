// lib/repos/menus.js
import { q } from '@/lib/db';
import { buildCollectionUrl, buildItemUrl, root } from '@/lib/routes';

const PUB = `status='published' AND (publish_at IS NULL OR publish_at<=NOW())`;

export async function getSideMenu(menuKey, locale) {
  const menu = await q(
    `SELECT id, default_title, title_override, header_href, is_active
     FROM side_menu_lists
     WHERE menu_key=:menuKey AND locale=:locale AND is_active=1
     LIMIT 1`,
    { menuKey, locale }
  ).then(r => r[0]);

  if (!menu) return null;

  // Otomatik öğeleri üret
  const autoItems = await buildAutoItems(menuKey, locale);

  // Override’ları çek
  const overrides = await q(
    `SELECT item_type, ref_id, label_override, href_override, visible, sort_order_override
     FROM side_menu_item_overrides
     WHERE menu_id=:menuId AND locale=:locale`,
    { menuId: menu.id, locale }
  );

  // Custom linkleri çek
  const custom = await q(
    `SELECT id, parent_id, label, href, sort_order, is_active
     FROM side_menu_custom_items
     WHERE menu_id=:menuId AND locale=:locale AND is_active=1
     ORDER BY sort_order, id`,
    { menuId: menu.id, locale }
  );

  // Override uygula
  const overrideKey = (x) => `${x.item_type}:${x.ref_id}`;
  const oMap = new Map(overrides.map(o => [overrideKey(o), o]));

  const applied = autoItems.map(item => {
    const key = overrideKey(item);
    const o = oMap.get(key);
    if (!o) return item;
    return {
      ...item,
      label: o.label_override ?? item.label,
      href: o.href_override ?? item.href,
      visible: o.visible ?? item.visible,
      sort_order: o.sort_order_override ?? item.sort_order,
    };
  }).filter(i => i.visible !== 0);

  // sort
  applied.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    title: menu.title_override || menu.default_title,
    headerHref: menu.header_href || defaultHeaderHref(menuKey, locale),
    items: applied,
    custom,
  };
}

function defaultHeaderHref(menuKey, locale) {
  if (menuKey === 'products') return root(locale, 'products');
  if (menuKey === 'spares')   return root(locale, 'spares');
  if (menuKey === 'services') return root(locale, 'services');
  if (menuKey === 'corporate')return root(locale, 'corporate');
  return '/';
}

async function buildAutoItems(menuKey, locale) {
  // Ürünler menüsünde "item"leri otomatik listeleyelim (isteğinize göre collection da olabilir)
  if (menuKey === 'products') {
    const rows = await q(
      `SELECT i.id, il.slug, il.title
       FROM items i
       JOIN item_locales il ON il.item_id=i.id AND il.locale=:locale
       WHERE i.type='product' AND ${PUB}
       ORDER BY i.sort_order, il.title`,
      { locale }
    );
    return rows.map((r, i) => ({
      item_type: 'item',
      ref_id: r.id,
      label: r.title,
      href: buildItemUrl('product', locale, r.slug),
      visible: 1,
      sort_order: i + 1,
    }));
  }
  if (menuKey === 'spares') {
    const rows = await q(
      `SELECT i.id, il.slug, il.title
       FROM items i
       JOIN item_locales il ON il.item_id=i.id AND il.locale=:locale
       WHERE i.type='spare' AND ${PUB}
       ORDER BY i.sort_order, il.title`,
      { locale }
    );
    return rows.map((r, i) => ({
      item_type: 'item',
      ref_id: r.id,
      label: r.title,
      href: buildItemUrl('spare', locale, r.slug),
      visible: 1,
      sort_order: i + 1,
    }));
  }
  if (menuKey === 'services') {
    const rows = await q(
      `SELECT i.id, il.slug, il.title
       FROM items i
       JOIN item_locales il ON il.item_id=i.id AND il.locale=:locale
       WHERE i.type='service' AND ${PUB}
       ORDER BY i.sort_order, il.title`,
      { locale }
    );
    return rows.map((r, i) => ({
      item_type: 'item',
      ref_id: r.id,
      label: r.title,
      href: buildItemUrl('service', locale, r.slug),
      visible: 1,
      sort_order: i + 1,
    }));
  }
  // corporate vb. için otomatik doldurmuyoruz
  return [];
}
