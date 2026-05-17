import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await requireAuth(req, res))) return;

  const { filename, data, mimeType } = req.body || {};
  if (!filename || !data) return res.status(400).json({ error: 'filename and data required' });

  const buffer = Buffer.from(data, 'base64');
  const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
  const objectName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('article-images')
    .upload(objectName, buffer, {
      contentType: mimeType || 'image/jpeg',
      cacheControl: '31536000',
    });

  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data: { publicUrl } } = supabase.storage
    .from('article-images')
    .getPublicUrl(objectName);

  return res.json({ url: publicUrl });
}
