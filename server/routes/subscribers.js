import { Router } from 'express';
import supabase from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/subscribers — public (newsletter signup)
router.post('/', async (req, res) => {
  const { email, name } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Check if already exists
  const { data: existing } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .single();

  if (existing) {
    if (existing.subscribed) {
      return res.json({ message: 'Already subscribed' });
    }
    // Re-subscribe
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
  res.status(201).json({ message: 'Successfully subscribed!' });
});

// GET /api/subscribers — admin
router.get('/', requireAuth, async (req, res) => {
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

  res.json({ subscribers, stats });
});

// DELETE /api/subscribers/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// POST /api/subscribers/:id/unsubscribe — public (via email link)
router.post('/:id/unsubscribe', async (req, res) => {
  const { error } = await supabase
    .from('subscribers')
    .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Unsubscribed successfully' });
});

export default router;
