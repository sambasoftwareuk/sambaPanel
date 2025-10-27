// lib/repos/gallery.js
const ADMIN = process.env.ADMIN_TOKEN;

export async function getMediaByScope(scope, { limit = 50, offset = 0, search = "" } = {}) {
  const qs = new URLSearchParams();
  if (scope) qs.set("scope", Array.isArray(scope) ? scope.join(",") : scope);
  if (limit) qs.set("limit", String(limit));
  if (offset) qs.set("offset", String(offset));
  if (search) qs.set("search", search);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/media?` + qs.toString(), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`getMediaByScope failed: ${res.status}`);
  return res.json(); // { items, count }
}

export async function createMedia({ url, alt_text, mime_type, scopes = [] }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/media`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(ADMIN ? { "x-admin-token": ADMIN } : {}),
    },
    body: JSON.stringify({ url, alt_text, mime_type, scopes }),
  });
  if (!res.ok) throw new Error(`createMedia failed: ${res.status}`);
  return res.json(); // { media, message }
}

export async function updateMediaScopes({ id, url, alt_text, mime_type, add_scopes = [], remove_scopes = [] }) {
  const payload = { id, add_scopes, remove_scopes };
  if (typeof url !== "undefined") payload.url = url;
  if (typeof alt_text !== "undefined") payload.alt_text = alt_text;
  if (typeof mime_type !== "undefined") payload.mime_type = mime_type;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/media`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(ADMIN ? { "x-admin-token": ADMIN } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`updateMediaScopes failed: ${res.status}`);
  return res.json(); // { media, message }
}
