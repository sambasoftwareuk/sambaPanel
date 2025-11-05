// app/api/media/route.js
import { NextResponse } from "next/server";
import { q, tx } from "@/lib/db";

function ok(data, init = 200) {
  return NextResponse.json(data, { status: init });
}
function bad(message, code = 400) {
  return NextResponse.json({ error: message }, { status: code });
}
function requireAdmin(req) {
  const need = process.env.ADMIN_TOKEN;
  if (!need) return true; // dev'de serbest bırak
  const got = req.headers.get("x-admin-token");
  return need && got && got === need;
}

// --- GET /api/media?scope=corporate&limit=24&offset=0&search=foo
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const scopeParam = searchParams.get("scope"); // "corporate" | "product" | "gallery" | "a,b,c"
  const search = searchParams.get("search")?.trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  const scopes = (scopeParam || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // scope verilmezse tüm media dönebilir; ama senin ihtiyacında hep scope ile çağıracağız.
  // Yine de güvenli: scope yoksa tümü + opsiyonel arama.
  const where = [];
  const params = { limit, offset };

  if (scopes.length) {
    where.push(`EXISTS (
      SELECT 1 FROM media_scopes ms
      WHERE ms.media_id = m.id AND ms.scope IN (${scopes
        .map((_, i) => `:s${i}`)
        .join(",")})
    )`);
    scopes.forEach((s, i) => (params[`s${i}`] = s));
  }

  if (search) {
    where.push(`(m.url LIKE :search OR m.alt_text LIKE :search)`);
    params.search = `%${search}%`;
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = await q(
    `
    SELECT m.id, m.url, m.alt_text, m.mime_type, m.created_at
    FROM media m
    ${whereSql}
    ORDER BY m.id DESC
    LIMIT :limit OFFSET :offset
    `,
    params
  );

  return ok({ items: rows, count: rows.length });
}

// --- POST /api/media
// Body:
// {
//   "url": "https://.../img.png",
//   "alt_text": "Kurumsal görsel",
//   "mime_type": "image/png",
//   "scopes": ["corporate"]   // zorunlu değil ama önerilir
// }
export async function POST(req) {
  if (!requireAdmin(req)) return bad("Unauthorized", 401);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const { url, alt_text = null, mime_type = null, scopes = [] } = payload || {};
  if (!url) return bad("url is required");

  try {
    const out = await tx(async (conn) => {
      // Önce mevcut kaydı kontrol et
      const [existing] = await conn.query(
        `SELECT id, url, alt_text, mime_type, created_at FROM media WHERE url = ? LIMIT 1`,
        [url]
      );

      let mediaId;
      if (existing.length > 0) {
        // Mevcut kayıt varsa, sadece scope'ları güncelle
        mediaId = existing[0].id;

        // Scope'ları ekle (varsa)
        if (Array.isArray(scopes) && scopes.length) {
          const values = scopes.map((s) => [mediaId, s]);
          await conn.query(
            `INSERT IGNORE INTO media_scopes (media_id, scope) VALUES ?`,
            [values]
          );
        }

        return existing[0];
      }

      // Yeni kayıt oluştur
      const [ins] = await conn.query(
        `INSERT INTO media (url, alt_text, mime_type) VALUES (?, ?, ?)`,
        [url, alt_text, mime_type]
      );
      mediaId = ins.insertId;

      // scope ilişkileri
      if (Array.isArray(scopes) && scopes.length) {
        const values = scopes.map((s) => [mediaId, s]);
        await conn.query(
          `INSERT IGNORE INTO media_scopes (media_id, scope) VALUES ?`,
          [values]
        );
      }

      // döndür
      const [row] = await conn.query(
        `SELECT id, url, alt_text, mime_type, created_at FROM media WHERE id=? LIMIT 1`,
        [mediaId]
      );
      return row[0];
    });

    return ok({ message: "media created", media: out }, 201);
  } catch (e) {
    return bad(e.message || "Server error", 500);
  }
}

// --- PATCH /api/media
// Body:
// {
//   "id": 123,
//   "url": "...",        // opsiyonel
//   "alt_text": "...",   // opsiyonel
//   "mime_type": "...",  // opsiyonel
//   "add_scopes": ["corporate"],         // opsiyonel
//   "remove_scopes": ["product","blog"]  // opsiyonel
// }
export async function PATCH(req) {
  if (!requireAdmin(req)) return bad("Unauthorized", 401);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const {
    id,
    url = undefined,
    alt_text = undefined,
    mime_type = undefined,
    add_scopes = [],
    remove_scopes = [],
  } = payload || {};

  if (!id) return bad("id is required");

  try {
    const out = await tx(async (conn) => {
      // meta update (sadece gelen alanları güncelle)
      const sets = [];
      const args = [];
      if (typeof url !== "undefined") {
        sets.push(`url=?`);
        args.push(url);
      }
      if (typeof alt_text !== "undefined") {
        sets.push(`alt_text=?`);
        args.push(alt_text);
      }
      if (typeof mime_type !== "undefined") {
        sets.push(`mime_type=?`);
        args.push(mime_type);
      }

      if (sets.length) {
        args.push(id);
        await conn.query(
          `UPDATE media SET ${sets.join(", ")} WHERE id=?`,
          args
        );
      }

      // scope ekle
      if (Array.isArray(add_scopes) && add_scopes.length) {
        const values = add_scopes.map((s) => [id, s]);
        await conn.query(
          `INSERT IGNORE INTO media_scopes (media_id, scope) VALUES ?`,
          [values]
        );
      }

      // scope sil
      if (Array.isArray(remove_scopes) && remove_scopes.length) {
        await conn.query(
          `DELETE FROM media_scopes WHERE media_id=? AND scope IN (${remove_scopes
            .map(() => `?`)
            .join(",")})`,
          [id, ...remove_scopes]
        );
      }

      const [[media]] = await Promise.all([
        conn.query(
          `SELECT id, url, alt_text, mime_type, created_at FROM media WHERE id=? LIMIT 1`,
          [id]
        ),
      ]);
      return media[0];
    });

    return ok({ message: "media updated", media: out });
  } catch (e) {
    return bad(e.message || "Server error", 500);
  }
}

// --- DELETE /api/media?id=123
export async function DELETE(req) {
  if (!requireAdmin(req)) return bad("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return bad("id is required");

  try {
    await tx(async (conn) => {
      // Önce media kaydını bul (dosya yolu için)
      const [mediaRows] = await conn.query(`SELECT url FROM media WHERE id=?`, [
        id,
      ]);
      if (mediaRows.length === 0) {
        throw new Error("Media bulunamadı");
      }

      const url = mediaRows[0].url;

      // media_scopes tablosundan sil
      await conn.query(`DELETE FROM media_scopes WHERE media_id=?`, [id]);

      // media tablosundan sil
      const [result] = await conn.query(`DELETE FROM media WHERE id=?`, [id]);
      if (result.affectedRows === 0) {
        throw new Error("Media silinemedi");
      }

      // Fiziksel dosyayı sil
      if (url && url.startsWith("/")) {
        try {
          const fs = require("fs");
          const path = require("path");
          const filePath = path.join(process.cwd(), "public", url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileError) {
          console.error("Dosya silinemedi:", fileError);
          // Dosya silme hatası olsa bile database silindi, devam et
        }
      }
    });

    return ok({ success: true, deleted: true });
  } catch (e) {
    return bad(e.message || "Server error", 500);
  }
}
