export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { q, tx } from '@/lib/db';
import sanitizeHtml from 'sanitize-html';
import { makeSlug } from '@/lib/slug';

export async function PATCH(request, { params }) {
  const { userId, sessionId } = getAuth(request); // <-- auth'u request'ten oku
  // geçici log
  console.log('PATCH getAuth =>', { userId, sessionId });

  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' }});
  }

  const id = Number(params.id);
  const body = await request.json();
  const locale = body.locale || 'tr-TR';
  const safeHtml = body.content_html !== undefined ? sanitizeHtml(body.content_html || '') : undefined;
  const newSlug = body.slug_i18n ? makeSlug(body.slug_i18n, locale) : undefined;

  await tx(async (conn) => {
    if (body.status || body.slug) {
      await conn.execute(
        `UPDATE pages SET
           status = COALESCE(?, status),
           slug   = COALESCE(?, slug),
           published_at = CASE WHEN ?='published' THEN COALESCE(published_at, NOW()) ELSE published_at END
         WHERE id=?`,
        [body.status || null, body.slug || null, body.status || null, id]
      );
    }

    const [exists] = await conn.execute(
      `SELECT id FROM page_locales WHERE page_id=? AND locale=? LIMIT 1`,
      [id, locale]
    );
    if (Array.isArray(exists) && exists.length) {
      await conn.execute(
        `UPDATE page_locales SET
           slug_i18n = COALESCE(?, slug_i18n),
           title = COALESCE(?, title),
           summary = COALESCE(?, summary),
           content_html = COALESCE(?, content_html),
           meta_title = COALESCE(?, meta_title),
           meta_description = COALESCE(?, meta_description),
           meta_robots = COALESCE(?, meta_robots)
         WHERE page_id=? AND locale=?`,
        [
          newSlug ?? null,
          body.title ?? null,
          body.summary ?? null,
          safeHtml ?? null,
          body.meta_title ?? null,
          body.meta_description ?? null,
          body.meta_robots ?? null,
          id, locale
        ]
      );
    } else {
      await conn.execute(
        `INSERT INTO page_locales (page_id, locale, slug_i18n, title, summary, content_html,
                                   meta_title, meta_description, meta_robots)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          id, locale, newSlug || makeSlug(body.title || 'sayfa', locale),
          body.title || 'Başlık',
          body.summary || null,
          safeHtml ?? null,
          body.meta_title || null,
          body.meta_description || null,
          body.meta_robots || null
        ]
      );
    }
  });

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' }});
}
