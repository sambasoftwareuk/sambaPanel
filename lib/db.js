import mysql from 'mysql2/promise'

let pool
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL, // mysql://user:pass@host:3306/db
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true
    })
  }
  return pool
}

// Safe query
export async function q(sql, params={}) {
  const [rows] = await getPool().query(sql, params)
  return rows
}

// Transaction helper
export async function tx(callback) {
  const conn = await getPool().getConnection()
  try {
    await conn.beginTransaction()
    const result = await callback(conn)
    await conn.commit()
    return result
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}
