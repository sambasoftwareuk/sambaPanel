// lib/repos/gallery.js
import { q } from '@/lib/db';

const PUB = `status='published' AND (publish_at IS NULL OR publish_at<=NOW())`;

export async function getGalleryAlbums(locale) {
  return q(
    `SELECT ga.id, gal.slug, gal.title, ga.is_main, ga.sort_order
     FROM gallery_albums ga
     JOIN gallery_album_locales gal ON gal.album_id=ga.id AND gal.locale=:locale
     WHERE ${PUB}
     ORDER BY ga.is_main DESC, ga.sort_order, ga.id`,
    { locale }
  );
}

export async function getAlbumBySlug(locale, slug) {
  return q(
    `SELECT ga.id, gal.slug, gal.title, gal.description, ga.is_main
     FROM gallery_albums ga
     JOIN gallery_album_locales gal ON gal.album_id=ga.id AND gal.locale=:locale
     WHERE gal.slug=:slug AND ${PUB}
     LIMIT 1`,
    { locale, slug }
  ).then(r => r[0] || null);
}

export async function getAlbumPhotos(locale, slug) {
  const album = await getAlbumBySlug(locale, slug);
  if (!album) return { album: null, photos: [] };

  const photos = await q(
    `SELECT gp.id, m.url, m.alt_text
     FROM gallery_photos gp
     JOIN media m ON m.id=gp.media_id
     WHERE gp.album_id=:albumId AND gp.${PUB.replaceAll('status', 'status')}
     ORDER BY gp.sort_order, gp.id`,
    { albumId: album.id }
  );

  const locs = await q(
    `SELECT photo_id, title, body_html
     FROM gallery_photo_locales
     WHERE locale=:locale AND photo_id IN (${photos.map(p => p.id).concat(0).join(',')})`,
    { locale }
  );

  const map = new Map(locs.map(l => [l.photo_id, l]));
  const detailed = photos.map(p => ({ ...p, ...(map.get(p.id) || {}) }));
  return { album, photos: detailed };
}

export async function getMainAlbumUncategorized(locale) {
  // "is_main=1" olan albümdeki bütün foto & videoları getir (örneğin ana akış)
  const main = await q(`SELECT id FROM gallery_albums WHERE is_main=1 LIMIT 1`).then(r => r[0]);
  if (!main) return { photos: [], videos: [] };

  const photos = await q(
    `SELECT gp.id, m.url, m.alt_text
     FROM gallery_photos gp
     JOIN media m ON m.id=gp.media_id
     WHERE gp.album_id=:id AND ${PUB}
     ORDER BY gp.sort_order, gp.id`,
    { id: main.id }
  );

  const videos = await q(
    `SELECT id, youtube_id, cached_title, cached_description
     FROM gallery_videos
     WHERE album_id=:id AND ${PUB}
     ORDER BY sort_order, id`,
    { id: main.id }
  );

  return { photos, videos };
}
