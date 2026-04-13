import supabase from '../_lib/supabase.js';
import { cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;

  const { error } = await supabase
    .from('subscribers')
    .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Unsubscribed successfully' });
}
