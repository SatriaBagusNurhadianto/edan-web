// scripts/send-reminders.mjs
// Sends H-3 deadline reminder emails via Resend.
// Requires env: DATABASE_URL, RESEND_API_KEY
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  const { rows } = await pool.query('SELECT r.email, s.title, s.deadline_label FROM reminders r JOIN scholarships s ON s.id = r.scholarship_id');
  console.log('reminders:', rows.length);
  // TODO: filter H-3 (deadline within 3 days), send via Resend API
  // for (const r of rows) { await fetch('https://api.resend.com/emails', {...}) }
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
