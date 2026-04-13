import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const route = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;

  // GET /api/articles/all — admin
  if (route === 'all' && req.method === 'GET') {
    if (!requireAuth(req, res)) return;

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
    if (!requireAuth(req, res)) return;

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
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    if (!requireAuth(req, res)) return;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
