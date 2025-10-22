// lib/repos/pages.js
import { q } from "@/lib/db";
import { getSideMenu } from "./menus";
import { DEFAULT_LOCALE } from "@/lib/routes";

const PUB = `p.status='published' AND (p.publish_at IS NULL OR p.publish_at<=NOW())`;

/**
 * getCorporatePage(locale?)
 * - locale verilmezse DEFAULT_LOCALE (tr-TR)
 * - Fallback: İstenen locale bulunamazsa TR (DEFAULT_LOCALE) denenir
 */
export async function getCorporatePage(locale = DEFAULT_LOCALE) {
  // 1) Önce istenen locale
  let page = await q(
    `SELECT p.id, p.hero_media_id, p.side_menu_key, p.status, p.publish_at,
            pl.locale, pl.slug, pl.title, pl.content_html,
            pl.meta_title, pl.meta_description, pl.og_title, pl.og_description, pl.json_ld,
            m.url AS hero_url, m.alt_text AS hero_alt
     FROM pages p
     JOIN page_locales pl ON pl.page_id=p.id AND pl.locale=:locale
     LEFT JOIN media m ON m.id = p.hero_media_id
     WHERE p.slug='kurumsal' AND ${PUB}
     LIMIT 1`,
    { locale }
  ).then((r) => r[0]);

  // 2) Yayınlanmış bulunamadıysa draft da kabul (admin önizleme gibi)
  if (!page) {
    page = await q(
      `SELECT p.id, p.hero_media_id, p.side_menu_key, p.status, p.publish_at,
              pl.locale, pl.slug, pl.title, pl.content_html,
              pl.meta_title, pl.meta_description, pl.og_title, pl.og_description, pl.json_ld,
              m.url AS hero_url, m.alt_text AS hero_alt
       FROM pages p
       JOIN page_locales pl ON pl.page_id=p.id AND pl.locale=:locale
       LEFT JOIN media m ON m.id = p.hero_media_id
       WHERE p.slug='corporate'
       LIMIT 1`,
      { locale }
    ).then((r) => r[0]);
  }

  // 3) Hâlâ yoksa ve locale TR değilse TR’ye fallback
  if (!page && locale !== DEFAULT_LOCALE) {
    page = await q(
      `SELECT p.id, p.hero_media_id, p.side_menu_key, p.status, p.publish_at,
              pl.locale, pl.slug, pl.title, pl.content_html,
              pl.meta_title, pl.meta_description, pl.og_title, pl.og_description, pl.json_ld,
              m.url AS hero_url, m.alt_text AS hero_alt
       FROM pages p
       JOIN page_locales pl ON pl.page_id=p.id AND pl.locale=:fallback
       LEFT JOIN media m ON m.id = p.hero_media_id
       WHERE p.slug='corporate' AND (${PUB} OR p.status IN ('draft','scheduled'))
       LIMIT 1`,
      { fallback: DEFAULT_LOCALE }
    ).then((r) => r[0]);
  }

  if (!page) return null;

  const sideMenu = page.side_menu_key
    ? await getSideMenu(page.side_menu_key, locale)
    : null;

  return { ...page, sideMenu };
}
