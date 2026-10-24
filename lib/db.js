// lib/db.js
import { Pool } from 'pg';

let pool;
export function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error('DATABASE_URL not set');
    // Vercel Postgres requires SSL; cert verification handled by platform CA bundle in prod.
    pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function query(text, params) {
  const p = getPool();
  return p.query(text, params);
}
