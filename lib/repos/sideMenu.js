// lib/repos/sideMenu.js
import { q } from '@/lib/db';

/**
 * Baslık bilgisi
 */
async function getMenuHeader(menuKey, locale) {
  const rows = await q(`
    SELECT
      COALESCE(NULLIF(TRIM(title_override), ''), default_title) AS title,
      href
    FROM side_menu_lists
    WHERE menu_key=:menuKey AND locale=:locale AND is_active=1
    LIMIT 1;
  `, { menuKey, locale });

  if (!rows.length) {
    return { title: 'Menu', href: '/' }; // sadece satır yoksa 'Menu'
  }
  return rows[0]; // burada artık title boş gelmez; default_title’a düşer
}


/**
 * Hangi segment group mu product mı?
 * - return { type: 'group'|'product'|null, group_id?, product_id?, group_slug? }
 */
async function resolveSegment(locale, slug) {
  if (!slug) return { type: null };

  // group?
  const g = await q(`
    SELECT pg.id
    FROM product_group_locales pgl
    JOIN product_groups pg ON pg.id = pgl.group_id
    WHERE pgl.locale=:locale AND pgl.slug_i18n=:slug AND pg.status='published'
    LIMIT 1;
  `, { locale, slug });
  if (g.length) return { type: 'group', group_id: g[0].id };

  // product?
  const p = await q(`
    SELECT pr.id, pr.group_id
    FROM product_locales pl
    JOIN products pr ON pr.id = pl.product_id
    WHERE pl.locale=:locale AND pl.slug_i18n=:slug AND pr.status='published'
    LIMIT 1;
  `, { locale, slug });
  if (p.length) return { type: 'product', product_id: p[0].id, group_id: p[0].group_id };

  return { type: null };
}

/**
 * Base: tüm gruplar (label, href, sort, id)
 */
async function getAllGroups(locale) {
  const rows = await q(`
    SELECT
      pg.id,
      pgl.name,
      pgl.slug_i18n,
      pg.sort_order,
      pg.status
    FROM product_groups pg
    JOIN product_group_locales pgl
      ON pgl.group_id = pg.id AND pgl.locale = :locale
    WHERE pg.status = 'published' AND pgl.slug_i18n IS NOT NULL
    ORDER BY pg.sort_order ASC, pg.id DESC;
  `, { locale });

  return rows.map(r => ({
    id: r.id,
    type: 'group',
    label: r.name,                              // sadece gereken
    href: `/urunler/${r.slug_i18n}`,            // slug_i18n'den üret
    sort: r.sort_order,
    status: r.status,
    visible: true
  }));
}


/**
 * Base: bir grubun ürünleri (label, href, sort, id)
 */
async function getProductsOfGroup(locale, groupSlug) {
  const rows = await q(`
    SELECT
      pr.id,
      pl.name,
      pl.slug_i18n,
      pr.sort_order,
      pr.status
    FROM product_group_locales pgl
    JOIN products pr ON pr.group_id = pgl.group_id
    JOIN product_locales pl ON pl.product_id = pr.id AND pl.locale = pgl.locale
    WHERE pgl.locale = :locale
      AND pgl.slug_i18n = :groupSlug
      AND pr.status = 'published'
      AND pl.slug_i18n IS NOT NULL
    ORDER BY pr.sort_order ASC, pr.id DESC;
  `, { locale, groupSlug });

  return rows.map(r => ({
    id: r.id,
    type: 'product',
    label: r.name,
    href: `/urunler/${groupSlug}/${r.slug_i18n}`,
    sort: r.sort_order,
    status: r.status,
    visible: true
  }));
}


/**
 * Override'ları map'le
 */
async function getOverrides(menuKey, locale, sourceType, ids) {
  if (!ids.length) return new Map();

  // id sayısı kadar "?" placeholder
  const placeholders = ids.map(() => '?').join(',');

  const sql = `
    SELECT source_id, label_override, href_override, is_visible, sort_order_override,
           parent_override_type, parent_override_id
    FROM side_menu_item_overrides
    WHERE menu_key=? AND locale=? AND source_type=? 
      AND source_id IN (${placeholders});
  `;

  // tüm parametreleri array olarak veriyoruz
  const rows = await q(sql, [menuKey, locale, sourceType, ...ids]);

  const map = new Map();
  for (const r of rows) {
    map.set(r.source_id, r);
  }
  return map;
}


/**
 * Override uygula + filtrele + sırala
 */
function applyOverrides(items, ovMap) {
  const out = [];
  for (const it of items) {
    const ov = ovMap.get(it.id);
    let label = ov?.label_override ?? it.label;
    let href  = ov?.href_override  ?? it.href;
    let visible = it.visible;
    if (ov && ov.is_visible !== null && ov.is_visible !== undefined) {
      visible = !!ov.is_visible;
    }
    let sort = ov?.sort_order_override ?? it.sort;

    if (!visible) continue;
    out.push({ ...it, label, href, sort });
  }
  // sort + stable fallback
  out.sort((a, b) => (a.sort - b.sort) || (b.id - a.id));
  return out;
}

/**
 * Çocuk menüleri (kompozisyon) getir
 */
async function getChildMenus(menuKey, locale) {
  const rows = await q(`
    SELECT child_menu_key, position
    FROM side_menu_compositions
    WHERE parent_menu_key=:menuKey AND locale=:locale
    ORDER BY position ASC;
  `, { menuKey, locale });
  return rows;
}

/**
 * Bir menüyü key ile üret (root görünüm: gruplar)
 */
// export async function getSideMenuByKey(menuKey = 'urunler', locale = 'tr-TR') {
//   const header = await getMenuHeader(menuKey, locale);
//   // Şimdilik 'urunler' özelinde: root'ta gruplar
//   const groups = await getAllGroups(locale);
//   const ov = await getOverrides(menuKey, locale, 'group', groups.map(g => g.id));
//   const items = applyOverrides(groups, ov);

//   // alt menü kompozisyonları
//   const children = await getChildMenus(menuKey, locale);

//   return {
//     title: header.title || 'Menu',
//     href: header.href || '/',
//     items,
//     children // [{child_menu_key, position}]
//   };
// }

/**
 * Yol'a göre menü: 
 * - /urunler                => gruplar listesi
 * - /urunler/:group         => grubun ürünleri
 * - /urunler/:group/:prod   => yine o grubun ürünleri (kardeşler)
 */
export async function getSideMenuForPath(path, locale = 'tr-TR') {
  const menuKey = 'urunler';
  const header = await getMenuHeader(menuKey, locale);

  const parts = (path || '').split('/').filter(Boolean);
  // beklenen: ['urunler', groupSlug?, productSlug?]
  const groupSlug = parts[1] || null;
  const productSlug = parts[2] || null;

  let items = [];
  let activeType = 'root';

  if (!groupSlug) {
    // /urunler
    const groups = await getAllGroups(locale);
    const ov = await getOverrides(menuKey, locale, 'group', groups.map(g => g.id));
    items = applyOverrides(groups, ov);
    activeType = 'root';
  } else if (groupSlug && !productSlug) {
    // /urunler/:group  -> grubun ürünleri
    const res = await resolveSegment(locale, groupSlug);
    // Eğer segment ürün ise, onun grubuna git
    const groupSlugToUse = (res.type === 'product')
      ? await (async () => {
          const gRow = await q(`
            SELECT pgl.slug_i18n AS slug
            FROM products pr
            JOIN product_group_locales pgl ON pgl.group_id = pr.group_id AND pgl.locale=:locale
            JOIN product_locales pl ON pl.product_id = pr.id AND pl.locale=:locale
            WHERE pl.slug_i18n=:pSlug
            LIMIT 1;
          `, { locale, pSlug: groupSlug });
          return gRow[0]?.slug || groupSlug;
        })()
      : groupSlug;

    const prods = await getProductsOfGroup(locale, groupSlugToUse);
    const ov = await getOverrides(menuKey, locale, 'product', prods.map(p => p.id));
    items = applyOverrides(prods, ov);
    activeType = 'group';
  } else {
    // /urunler/:group/:product -> yine grubun ürünleri
    const prods = await getProductsOfGroup(locale, groupSlug);
    const ov = await getOverrides(menuKey, locale, 'product', prods.map(p => p.id));
    items = applyOverrides(prods, ov);
    activeType = 'product';
  }

  // Ek menüler (altına başka menü)
  const children = await getChildMenus(menuKey, locale);

  return {
    title: header.title || 'Menu',
    href: header.href || '/',
    items,
    activeType,
    children // [{child_menu_key, position}]
  };
}
