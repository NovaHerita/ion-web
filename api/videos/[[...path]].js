import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const raw = Array.isArray(req.query.path) ? req.query.path : (req.query.path ? [req.query.path] : []);
  const parts = raw[0] === '__root' ? raw.slice(1) : raw;
  const route = parts.join('/');

  // GET /api/videos — public list of published videos
  if (route === '' && req.method === 'GET') {
    const { data, error } = await supabase
      .from('videos')
      .select('id, title, description, video_url, file_path, is_external, thumbnail_url, sort_order, created_at')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // POST /api/videos — admin create
  if (route === '' && req.method === 'POST') {
    if (!(await requireAuth(req, res))) return;

    const { title, description, video_url, thumbnail_url, published } = req.body || {};

    const { data, error } = await supabase
      .from('videos')
      .insert({
        title,
        description: description || '',
        video_url: video_url || '',
        is_external: true,
        thumbnail_url: thumbnail_url || '',
        published: published !== false,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // GET /api/videos/all — admin
  if (route === 'all' && req.method === 'GET') {
    if (!(await requireAuth(req, res))) return;

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // PUT /api/videos/reorder — admin
  if (route === 'reorder' && req.method === 'PUT') {
    if (!(await requireAuth(req, res))) return;

    const { order } = req.body || {};
    if (!Array.isArray(order)) return res.status(400).json({ error: 'order array required' });

    for (const { id, sort_order } of order) {
      const { error } = await supabase
        .from('videos')
        .update({ sort_order })
        .eq('id', id);

      if (error) return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  }

  // /api/videos/:id — PUT, DELETE
  const id = route;

  if (req.method === 'PUT') {
    if (!(await requireAuth(req, res))) return;

    const { title, description, video_url, thumbnail_url, published } = req.body || {};

    const { data, error } = await supabase
      .from('videos')
      .update({
        title,
        description,
        video_url,
        thumbnail_url,
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
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
