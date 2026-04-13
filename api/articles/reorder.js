import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireAuth(req, res)) return;

  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order array required' });

  for (const { id, sort_order } of order) {
    const { error } = await supabase
      .from('articles')
      .update({ sort_order })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
  }
  res.json({ success: true });
}
