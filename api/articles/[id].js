import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });

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

    const { title, category, summary, image_url, content, external_url, is_external, published } = req.body || {};

    const { data, error } = await supabase
      .from('articles')
      .update({
        title,
        category,
        summary,
        image_url: image_url || '',
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
