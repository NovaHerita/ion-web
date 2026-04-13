import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;

  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('sent_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}
