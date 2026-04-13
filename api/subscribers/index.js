import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { email, name } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const { data: existing } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.subscribed) {
        return res.json({ message: 'Already subscribed' });
      }
      const { error } = await supabase
        .from('subscribers')
        .update({ subscribed: true, unsubscribed_at: null, subscribed_at: new Date().toISOString() })
        .eq('email', email);

      if (error) return res.status(500).json({ error: error.message });
      return res.json({ message: 'Welcome back! You have been re-subscribed.' });
    }

    const { error } = await supabase
      .from('subscribers')
      .insert({ email, name: name || '' });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Successfully subscribed!' });
  }

  if (req.method === 'GET') {
    if (!(await requireAuth(req, res))) return;

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const stats = {
      total: subscribers.length,
      active: subscribers.filter((s) => s.subscribed).length,
      unsubscribed: subscribers.filter((s) => !s.subscribed).length,
    };

    return res.json({ subscribers, stats });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
