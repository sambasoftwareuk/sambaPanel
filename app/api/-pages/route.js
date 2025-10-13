export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // cache kapansın
export const revalidate = 0
import { NextResponse } from 'next/server'
import { q, tx } from '@/lib/db'
import { PageCreate } from '@/lib/validate'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale') || undefined
  const status = searchParams.get('status') || undefined
  const limit = Number(searchParams.get('limit') || 20)
  const offset = Number(searchParams.get('offset') || 0)

  // Basit liste (locale join opsiyonel)
  const rows = await q(
`SELECT p.*, JSON_ARRAYAGG(JSON_OBJECT(
  'id', pl.id, 'locale', pl.locale, 'title', pl.title
)) AS locales
FROM pages p
LEFT JOIN page_locales pl ON pl.page_id=p.id ${locale ? 'AND pl.locale=:locale' : ''}
WHERE 1=1 ${status ? 'AND p.status=:status' : ''}
GROUP BY p.id
ORDER BY p.updated_at DESC
LIMIT :limit OFFSET :offset;`,
    { locale, status, limit, offset }
  )

  return NextResponse.json({ ok: true, data: rows })
}

export async function POST(req) {
  try {
    const body = await req.json()
    const parsed = PageCreate.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok:false, error:'Invalid body', issues:parsed.error.issues }, { status:400 })
    }
    const d = parsed.data

    const result = await tx(async (conn) => {
      const [res] = await conn.execute(
        `INSERT INTO pages (page_key, slug, template, status, canonical_url, is_indexable, changefreq, priority, hero_media_id)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          d.page_key, d.slug, d.template || null, d.status || 'draft',
          d.canonical_url || null, d.is_indexable ?? 1, d.changefreq || 'monthly',
          d.priority ?? null, d.hero_media_id ?? null
        ]
      )
      const pageId = res.insertId

      for (const l of d.locales) {
        await conn.execute(
          `INSERT INTO page_locales 
           (page_id, locale, title, summary, content_html, content_json, meta_title, meta_description, meta_keywords, meta_robots,
            canonical_url_i18n, hreflangs_json, og_title, og_description, og_image_id, twitter_title, twitter_description, twitter_card,
            json_ld, extra_head)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            pageId, l.locale, l.title, l.summary || null, l.content_html || null, JSON.stringify(l.content_json ?? null),
            l.meta_title || null, l.meta_description || null, l.meta_keywords || null, l.meta_robots || null,
            l.canonical_url_i18n || null, JSON.stringify(l.hreflangs_json ?? null),
            l.og_title || null, l.og_description || null, l.og_image_id || null,
            l.twitter_title || null, l.twitter_description || null, l.twitter_card || 'summary_large_image',
            JSON.stringify(l.json_ld ?? null), JSON.stringify(l.extra_head ?? null)
          ]
        )
      }

      if (Array.isArray(d.blocks)) {
        for (const b of d.blocks) {
          const [br] = await conn.execute(
            `INSERT INTO page_blocks (page_id, type, sort_order) VALUES (?,?,?)`,
            [pageId, b.type, b.sort_order ?? 0]
          )
          const blockId = br.insertId
          for (const bl of b.locales) {
            await conn.execute(
              `INSERT INTO page_block_locales (block_id, locale, data_json) VALUES (?,?,?)`,
              [blockId, bl.locale, JSON.stringify(bl.data_json)]
            )
          }
        }
      }

      const [page] = await conn.query(`SELECT * FROM pages WHERE id=?`, [pageId])
      return page[0]
    })

    return NextResponse.json({ ok:true, data: result }, { status:201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok:false, error:'Server error' }, { status:500 })
  }
}
