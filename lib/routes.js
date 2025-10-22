// lib/routes.js
// Basit kural: TR'de prefix yok, EN'de '/en' prefix var.
// Tüm path üretimleri bu dosyadan geçsin ki ileride locale/pattern değişse tek yerden güncellensin.

export const DEFAULT_LOCALE = 'tr-TR';
export const SUPPORTED_LOCALES = ['tr-TR', 'en-US'];

const ROOTS = {
  'tr-TR': {
    base: '',
    corporate: '/kurumsal',
    products: '/urunler',
    spares: '/yedek-parcalar',
    services: '/hizmetler',
    blog: '/blog',
    catalogs: '/e-katalog',
    gallery: '/galeri',
    contact: '/iletisim',
  },
  'en-US': {
    base: '/en',
    corporate: '/corporate',      // <- yeni kural: /en/corporate
    products: '/products',
    spares: '/spare-parts',
    services: '/services',
    blog: '/blog',
    catalogs: '/e-catalog',
    gallery: '/gallery',
    contact: '/contact',
  },
};

/**
 * root(locale, key?)
 * - key verilirse: base + bilinen path (örn: root('tr-TR','products') => /urunler)
 * - key verilmezse: sadece base döner (TR:'', EN:'/en')
 */
export function root(locale, key) {
  const conf = ROOTS[locale] || ROOTS[DEFAULT_LOCALE];
  if (!key) return conf.base || '';
  const path = conf[key];
  if (!path) {
    // Bilinmeyen key geldiyse güvenli fallback: base + key'i path gibi kullan
    const clean = `/${String(key).replace(/^\/+/, '')}`;
    return (conf.base || '') + clean;
  }
  return (conf.base || '') + path;
}

/** 'product' | 'spare' | 'service' -> routes key */
function mapTypeKey(type) {
  if (type === 'spare') return 'spares';
  if (type === 'service') return 'services';
  return 'products';
}

/** Koleksiyon (grup) sayfası: /urunler/:slug veya /en/products/:slug */
export function buildCollectionUrl(type, locale, slug) {
  return `${root(locale, mapTypeKey(type))}/${slug}`;
}

/** Öğeler (ürün, yedek parça, hizmet): /urunler/:slug vb. */
export function buildItemUrl(type, locale, slug) {
  return `${root(locale, mapTypeKey(type))}/${slug}`;
}

/** Blog yazısı: /blog/:slug veya /en/blog/:slug */
export function buildBlogPostUrl(locale, slug) {
  return `${root(locale, 'blog')}/${slug}`;
}

/**
 * Genel sayfa/link üretimi:
 * - key ROOTS içinde varsa onu kullanır (örn: 'corporate' -> /kurumsal veya /en/corporate)
 * - yoksa verilen değeri base altına relative path olarak ekler
 */
export function buildPageUrl(locale, keyOrPath = '') {
  const conf = ROOTS[locale] || ROOTS[DEFAULT_LOCALE];
  const known = conf[keyOrPath];
  if (known) return (conf.base || '') + known;
  const clean = `/${String(keyOrPath).replace(/^\/+/, '')}`;
  return (conf.base || '') + clean;
}
