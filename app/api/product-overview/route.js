import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { tx } from "@/lib/db";
import { isRouteAuthorized } from "@/lib/auth";

function bad(message, code = 400) {
  return NextResponse.json({ error: message }, { status: code });
}

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "figure", "figcaption"]),
  allowedAttributes: { a: ["href", "name", "target", "rel"], img: ["src", "alt", "width", "height", "loading"], "*": ["style", "class"] },
  allowedSchemes: ["http", "https", "mailto", "tel", "data"],
};

export async function PATCH(req) {
  if (!isRouteAuthorized(req)) return bad("Unauthorized", 401);

  let body;
  try { body = await req.json(); } catch { return bad("Invalid JSON"); }

  const { title, content_html, locale = "tr-TR" } = body || {};
  const safeHtml = typeof content_html === "string" ? sanitizeHtml(content_html, sanitizeOptions) : undefined;

  try {
    const page = await tx(async (conn) => {
      const [pages] = await conn.query(`SELECT id FROM pages WHERE slug = ? LIMIT 1`, ["urunler"]);
      let pageId = pages[0]?.id;

      if (!pageId) {
        const [ins] = await conn.query(
          `INSERT INTO pages (page_key, slug, template, status, canonical_url) VALUES (?, ?, ?, ?, ?)`,
          ["urunler", "urunler", "overview", "published", "/urunler"]
        );
        pageId = ins.insertId;
      }

      const [locales] = await conn.query(
        `SELECT id FROM page_locales WHERE page_id = ? AND locale = ? LIMIT 1`,
        [pageId, locale]
      );

      if (locales.length) {
        await conn.query(
          `UPDATE page_locales SET title = COALESCE(?, title), content_html = COALESCE(?, content_html) WHERE page_id = ? AND locale = ?`,
          [title ?? null, safeHtml ?? null, pageId, locale]
        );
      } else {
        await conn.query(
          `INSERT INTO page_locales (page_id, locale, slug, title, content_html) VALUES (?, ?, ?, ?, ?)`,
          [pageId, locale, "urunler", title || "Ürünlerimiz", safeHtml || "<p></p>"]
        );
      }

      const [out] = await conn.query(
        `SELECT p.id, pl.locale, pl.slug, pl.title, pl.content_html FROM pages p JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = ? WHERE p.id = ? LIMIT 1`,
        [locale, pageId]
      );
      return out[0];
    });

    return NextResponse.json({ message: "Product overview updated", page });
  } catch (e) {
    console.error(e);
    return bad(e.message || "Server error", 500);
  }
}
