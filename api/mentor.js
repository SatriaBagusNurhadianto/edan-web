// api/mentor.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, topic } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'missing fields' });
    try {
      await query('INSERT INTO mentors (name, email, topic) VALUES ($1,$2,$3)', [name, email, topic || null]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  if (req.method === 'GET') {
    try {
      const r = await query('SELECT * FROM mentors ORDER BY created_at DESC LIMIT 100');
      return res.status(200).json(r.rows);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  return res.status(405).json({ error: 'method not allowed' });
}
