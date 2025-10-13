// lib/db.js
import mysql from "mysql2/promise";
import { URL } from "url";

let pool;

/** Parse DATABASE_URL and build a robust pool config */
function getPoolConfig() {
  const url = new URL(process.env.DATABASE_URL);
  const [user, password] = [decodeURIComponent(url.username), decodeURIComponent(url.password)];
  const [host, port] = [url.hostname, Number(url.port || 3306)];
  const database = url.pathname.replace(/^\//, "");
  const search = Object.fromEntries(url.searchParams.entries());

  // SSL
  const useSSL = (process.env.DB_SSL || "false").toLowerCase() === "true";
  let ssl = undefined;
  if (useSSL) {
    const ca = process.env.DB_SSL_CA?.trim();
    ssl = ca ? { ca } : { rejectUnauthorized: true };
  }

  return {
    host,
    port,
    user,
    password,
    database,
    // Pool
    waitForConnections: true,
    connectionLimit: Number(search.connectionLimit || 10),
    queueLimit: 0,
    // Quality of life
    namedPlaceholders: true,
    dateStrings: true,           // DATETIME → string
    decimalNumbers: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
    timezone: process.env.DB_TIMEZONE || "+00:00",
    ssl,
  };
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(getPoolConfig());

    // Optional: connection warm-up (first query)
    pool.query("SELECT 1").catch(() => {});
    // Graceful shutdown in custom servers
    if (typeof process !== "undefined") {
      const close = async () => { try { await pool.end(); } catch {} };
      process.on("beforeExit", close);
      process.on("SIGINT", async () => { await close(); process.exit(0); });
      process.on("SIGTERM", async () => { await close(); process.exit(0); });
    }
  }
  return pool;
}

/** Safe query with automatic retry on transient errors */
export async function q(sql, params = {}) {
  const p = getPool();
  const maxRetries = 2;
  let lastErr;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Per-connection session settings
      // (set names handled by driver; set time_zone from env)
      if (attempt === 0) {
        // optional: ensure time_zone each time we get a new connection
      }
      const [rows] = await p.query(sql, params);
      return rows;
    } catch (e) {
      lastErr = e;
      // retry only on transient errors
      const transient = isTransientMySQLError(e);
      if (!transient || attempt === maxRetries) throw e;
      await sleep(200 * (attempt + 1));
    }
  }
  throw lastErr;
}

/** Transaction helper */
export async function tx(callback) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (e) {
    try { await conn.rollback(); } catch {}
    throw e;
  } finally {
    conn.release();
  }
}

// Helpers
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function isTransientMySQLError(err) {
  // Common transient codes: ER_LOCK_DEADLOCK(1213), ER_LOCK_WAIT_TIMEOUT(1205), PROTOCOL_CONNECTION_LOST, ECONNRESET, ETIMEDOUT
  const msg = String(err?.code || err?.message || "").toUpperCase();
  return (
    msg.includes("PROTOCOL_CONNECTION_LOST") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ETIMEDOUT") ||
    err?.errno === 1205 ||
    err?.errno === 1213
  );
}

/** Healthcheck (for /api/health) */
export async function dbHealth() {
  try {
    const rows = await q("SELECT 1 AS ok");
    return rows?.[0]?.ok === 1;
  } catch {
    return false;
  }
}
