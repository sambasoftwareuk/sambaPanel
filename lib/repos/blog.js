// lib/repos/blog.js
import { q } from "@/lib/db";
import { buildBlogPostUrl } from "@/lib/routes";

const PUBP = `bp.status='published' AND (bp.publish_at IS NULL OR bp.publish_at<=NOW())`;

export async function getBlogList(
  locale,
  { categorySlug, tagSlug, page = 1, limit = 10 } = {}
) {
  const offset = (page - 1) * limit;
  const params = { locale, limit, offset };
  let join = "";
  let where = `WHERE ${PUBP}`;
  if (categorySlug) {
    join += `
      JOIN blog_post_categories bpc ON bpc.post_id = bp.id
      JOIN blog_categories bc ON bc.id = bpc.category_id
      JOIN blog_category_locales bcl ON bcl.category_id=bc.id AND bcl.locale=:locale`;
    where += ` AND bcl.slug=:categorySlug`;
    params.categorySlug = categorySlug;
  }
  if (tagSlug) {
    join += `
      JOIN blog_post_tags bpt ON bpt.post_id = bp.id
      JOIN blog_tags bt ON bt.id = bpt.tag_id
      JOIN blog_tag_locales btl ON btl.tag_id=bt.id AND btl.locale=:locale`;
    where += ` AND btl.slug=:tagSlug`;
    params.tagSlug = tagSlug;
  }

  const rows = await q(
    `SELECT bp.id, bpl.slug, bpl.title, bpl.summary, 
            m.url AS hero_url, m.alt_text AS hero_alt,
            COALESCE(bp.publish_at, bp.created_at) AS dt
     FROM blog_posts bp
     JOIN blog_post_locales bpl ON bpl.post_id=bp.id AND bpl.locale=:locale
     LEFT JOIN media m ON m.id = bp.hero_media_id
     ${join}
     ${where}
     ORDER BY dt DESC
     LIMIT :limit OFFSET :offset`,
    params
  );

  return rows.map((r) => ({ ...r, href: buildBlogPostUrl(locale, r.slug) }));
}

export async function getBlogPostBySlug(locale, slug) {
  const post = await q(
    `SELECT bp.id, bpl.slug, bpl.title, bpl.summary, bpl.body_html,
            m.url AS hero_url, m.alt_text AS hero_alt,
            COALESCE(bp.publish_at, bp.created_at) AS dt
     FROM blog_posts bp
     JOIN blog_post_locales bpl ON bpl.post_id=bp.id AND bpl.locale=:locale
     LEFT JOIN media m ON m.id = bp.hero_media_id
     WHERE bpl.slug=:slug AND ${PUBP}
     LIMIT 1`,
    { locale, slug }
  ).then((r) => r[0]);
  if (!post) return null;

  const categories = await q(
    `SELECT bcl.title, bcl.slug
     FROM blog_post_categories bpc
     JOIN blog_category_locales bcl ON bcl.category_id=bpc.category_id AND bcl.locale=:locale
     WHERE bpc.post_id=:id
     ORDER BY bcl.title`,
    { id: post.id, locale }
  );

  const tags = await q(
    `SELECT btl.title, btl.slug
     FROM blog_post_tags bpt
     JOIN blog_tag_locales btl ON btl.tag_id=bpt.tag_id AND btl.locale=:locale
     WHERE bpt.post_id=:id
     ORDER BY btl.title`,
    { id: post.id, locale }
  );

  return { ...post, categories, tags };
}

// Minimal: only title and slug (for layout/footer)
export async function getBlogTitleSlug(locale, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const rows = await q(
    `SELECT bpl.title, bpl.slug,
            COALESCE(bp.publish_at, bp.created_at) AS dt
     FROM blog_posts bp
     JOIN blog_post_locales bpl ON bpl.post_id=bp.id AND bpl.locale=:locale
     WHERE ${PUBP}
     ORDER BY dt DESC
     LIMIT :limit OFFSET :offset`,
    { locale, limit, offset }
  );
  return rows.map(({ title, slug }) => ({ title, slug }));
}

/*
// 
export async function getBlogs(locale, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  return await q(
    `SELECT bpl.title, bpl.slug, bpl.summary,
            COALESCE(bp.publish_at, bp.created_at) AS dt
     FROM blog_posts bp
     JOIN blog_post_locales bpl ON bpl.post_id=bp.id AND bpl.locale=:locale
     WHERE ${PUBP}
     ORDER BY dt DESC
     LIMIT :limit OFFSET :offset`,
    { locale, limit, offset }
  );
}

//
export async function getSingleBlogIDSlug(locale, slug) {
  return await getBlogPostBySlug(locale, slug);
}
*/
