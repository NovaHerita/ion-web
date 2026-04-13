import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('videos')
      .select('id, title, description, video_url, file_path, is_external, thumbnail_url, sort_order, created_at')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    if (!requireAuth(req, res)) return;

    const { title, description, video_url, thumbnail_url, published } = req.body;

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

  res.status(405).json({ error: 'Method not allowed' });
}
