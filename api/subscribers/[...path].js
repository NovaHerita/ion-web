import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const parts = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
  const id = parts[0];

  // POST /api/subscribers/:id/unsubscribe
  if (parts.length === 2 && parts[1] === 'unsubscribe' && req.method === 'POST') {
    const { error } = await supabase
      .from('subscribers')
      .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ message: 'Unsubscribed successfully' });
  }

  // DELETE /api/subscribers/:id
  if (req.method === 'DELETE') {
    if (!requireAuth(req, res)) return;

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
