import { Router } from 'express';
import supabase from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/articles — public, returns published articles
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, category, summary, content, external_url, is_external, sort_order, created_at')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/articles/all — admin, returns all articles
router.get('/all', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/articles/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// POST /api/articles — admin
router.post('/', requireAuth, async (req, res) => {
  const { title, category, summary, content, external_url, is_external, published } = req.body;

  const { data, error } = await supabase
    .from('articles')
    .insert({
      title,
      category: category || 'INSIGHT',
      summary: summary || '',
      content: content || '',
      external_url: external_url || '',
      is_external: is_external ? true : false,
      published: published !== false,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/articles/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  const { title, category, summary, content, external_url, is_external, published } = req.body;

  const { data, error } = await supabase
    .from('articles')
    .update({
      title,
      category,
      summary,
      content,
      external_url,
      is_external: is_external ? true : false,
      published: published ? true : false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/articles/reorder — admin (accepts array of {id, sort_order})
router.put('/reorder', requireAuth, async (req, res) => {
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
});

// DELETE /api/articles/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
