// app/api/items/[slug]/route.js
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { getAuth } from "@clerk/nextjs/server";
import { getProductBySlug } from "@/lib/repos/products";
import { tx } from "@/lib/db";

function ok(data, init = 200) {
  return NextResponse.json(data, { status: init });
}

function bad(message, code = 400) {
  return NextResponse.json({ error: message }, { status: code });
}

function requireAuth(req) {
  const { userId } = getAuth(req);
  if (userId) return true;

  const need = process.env.ADMIN_TOKEN;
  if (!need) return true;

  const got = req.headers.get("x-admin-token");
  return need && got && got === need;
}

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "figure",
    "figcaption",
    "iframe",
  ]),
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    iframe: [
      "src",
      "width",
      "height",
      "allow",
      "allowfullscreen",
      "frameborder",
      "title",
      "referrerpolicy",
    ],
    "*": ["style", "class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel", "data"],
};

export async function GET(req, { params }) {
  const locale = req.headers.get("x-locale") || "tr-TR";
  const { slug } = await params;
  const data = await getProductBySlug(slug, locale, "product");
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req, { params }) {
  if (!requireAuth(req)) return bad("Unauthorized", 401);

  const { slug } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const {
    title,
    content_html,
    hero_media_id,
    locale = "tr-TR",
    type = "product",
  } = body || {};

  if (!locale) return bad("locale is required");

  const safeHtml =
    typeof content_html === "string"
      ? sanitizeHtml(content_html, sanitizeOptions)
      : undefined;

  try {
    const result = await tx(async (conn) => {
      const [rows] = await conn.query(
        `SELECT i.id
         FROM items i
         JOIN item_locales il ON il.item_id = i.id AND il.locale = ?
         WHERE il.slug = ? AND i.type = ?
         LIMIT 1`,
        [locale, slug, type]
      );

      if (!rows.length) {
        const err = new Error("Item not found");
        err.status = 404;
        throw err;
      }

      const itemId = rows[0].id;

      if (title !== undefined || safeHtml !== undefined) {
        await conn.query(
          `UPDATE item_locales
             SET title = COALESCE(?, title),
                 body_html = COALESCE(?, body_html)
           WHERE item_id = ? AND locale = ?`,
          [title ?? null, safeHtml ?? null, itemId, locale]
        );
      }

      if (hero_media_id !== undefined) {
        const [mediaRows] = await conn.query(
          `SELECT id FROM item_media
           WHERE item_id = ?
           ORDER BY sort_order IS NULL, sort_order, id
           LIMIT 1`,
          [itemId]
        );

        if (mediaRows.length) {
          await conn.query(`UPDATE item_media SET media_id = ? WHERE id = ?`, [
            hero_media_id,
            mediaRows[0].id,
          ]);
        } else if (hero_media_id !== null) {
          await conn.query(
            `INSERT INTO item_media (item_id, media_id, sort_order) VALUES (?, ?, 0)`,
            [itemId, hero_media_id]
          );
        }
      }

      const [out] = await conn.query(
        `SELECT i.id, il.slug, il.title, il.body_html,
                m.url AS hero_url, m.alt_text AS hero_alt
         FROM items i
         JOIN item_locales il ON il.item_id = i.id AND il.locale = ?
         LEFT JOIN (
           SELECT im.item_id, im.media_id
           FROM item_media im
           JOIN (
             SELECT item_id, MIN(sort_order) AS min_sort
             FROM item_media
             GROUP BY item_id
           ) x ON x.item_id = im.item_id AND x.min_sort = im.sort_order
         ) pim ON pim.item_id = i.id
         LEFT JOIN media m ON m.id = pim.media_id
         WHERE i.id = ?
         LIMIT 1`,
        [locale, itemId]
      );

      return out[0];
    });

    return ok({ message: "Item updated", item: result });
  } catch (e) {
    console.error(e);
    return bad(e.message || "Server error", e.status || 500);
  }
}
