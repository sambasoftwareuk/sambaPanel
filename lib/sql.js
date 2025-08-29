export const selectPageBySlug = `
  SELECT p.*, pl.*
  FROM pages p
  JOIN page_locales pl ON pl.page_id=p.id
  WHERE p.slug=:slug AND pl.locale=:locale
  LIMIT 1;
`

export const insertPage = `
  INSERT INTO pages (page_key, slug, template, status, canonical_url, is_indexable, changefreq, priority, hero_media_id)
  VALUES (:page_key, :slug, :template, :status, :canonical_url, :is_indexable, :changefreq, :priority, :hero_media_id);
`

export const insertPageLocale = `
  INSERT INTO page_locales (page_id, locale, title, summary, content_html, content_json,
    meta_title, meta_description, meta_keywords, meta_robots, canonical_url_i18n, hreflangs_json,
    og_title, og_description, og_image_id, twitter_title, twitter_description, twitter_card, json_ld, extra_head)
  VALUES (:page_id, :locale, :title, :summary, :content_html, :content_json,
    :meta_title, :meta_description, :meta_keywords, :meta_robots, :canonical_url_i18n, :hreflangs_json,
    :og_title, :og_description, :og_image_id, :twitter_title, :twitter_description, :twitter_card, :json_ld, :extra_head);
`
