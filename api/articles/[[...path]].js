import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const rawPath = req.query['...path'] ?? req.query.path;
  const raw = Array.isArray(rawPath) ? rawPath : (rawPath ? rawPath.split('/') : []);
  const parts = raw[0] === '__root' ? raw.slice(1) : raw;
  const route = parts.join('/');

  // GET /api/articles — public list of published articles
  if (route === '' && req.method === 'GET') {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, summary, content, external_url, is_external, sort_order, created_at')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // POST /api/articles — admin create
  if (route === '' && req.method === 'POST') {
    if (!(await requireAuth(req, res))) return;

    const { title, category, summary, content, external_url, is_external, published } = req.body || {};

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
    return res.status(201).json(data);
  }

  // GET /api/articles/all — admin
  if (route === 'all' && req.method === 'GET') {
    if (!(await requireAuth(req, res))) return;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // PUT /api/articles/reorder — admin
  if (route === 'reorder' && req.method === 'PUT') {
    if (!(await requireAuth(req, res))) return;

    const { order } = req.body || {};
    if (!Array.isArray(order)) return res.status(400).json({ error: 'order array required' });

    for (const { id, sort_order } of order) {
      const { error } = await supabase
        .from('articles')
        .update({ sort_order })
        .eq('id', id);

      if (error) return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  }

  // /api/articles/:id — GET, PUT, DELETE
  const id = route;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Not found' });
    return res.json(data);
  }

  if (req.method === 'PUT') {
    if (!(await requireAuth(req, res))) return;

    const { title, category, summary, content, external_url, is_external, published } = req.body || {};

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
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    if (!(await requireAuth(req, res))) return;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
