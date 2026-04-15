import supabase from './_lib/supabase.js';
import { requireAuth, cors } from './_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /api/articles — public list of published articles
  if (req.method === 'GET') {
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
  if (req.method === 'POST') {
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

  res.status(405).json({ error: 'Method not allowed' });
}
