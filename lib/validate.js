import { z } from 'zod'

export const PageCreate = z.object({
  page_key: z.string().min(1),
  slug: z.string().min(1),
  template: z.string().optional(),
  status: z.enum(['draft','published','archived']).optional(),
  canonical_url: z.string().url().optional(),
  is_indexable: z.boolean().optional(),
  changefreq: z.enum(['always','hourly','daily','weekly','monthly','yearly','never']).optional(),
  priority: z.number().min(0).max(1).optional(),
  hero_media_id: z.number().int().positive().optional(),
  locales: z.array(z.object({
    locale: z.string().min(2),
    title: z.string().min(1),
    summary: z.string().optional(),
    content_html: z.string().optional(),
    content_json: z.any().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_keywords: z.string().optional(),
    meta_robots: z.string().optional(),
    canonical_url_i18n: z.string().url().optional(),
    hreflangs_json: z.any().optional(),
    og_title: z.string().optional(),
    og_description: z.string().optional(),
    og_image_id: z.number().int().positive().optional(),
    twitter_title: z.string().optional(),
    twitter_description: z.string().optional(),
    twitter_card: z.enum(['summary','summary_large_image']).optional(),
    json_ld: z.any().optional(),
    extra_head: z.any().optional(),
  })).min(1),
  blocks: z.array(z.object({
    type: z.string().min(1),
    sort_order: z.number().int().nonnegative().optional(),
    locales: z.array(z.object({
      locale: z.string().min(2),
      data_json: z.any()
    })).min(1)
  })).optional()
})
