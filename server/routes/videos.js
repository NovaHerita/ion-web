import { Router } from 'express';
import multer from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import supabase from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = file.originalname.split('.').pop();
    cb(null, `video-${unique}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

// GET /api/videos — public
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, description, video_url, file_path, is_external, thumbnail_url, sort_order, created_at')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/videos/all — admin
router.get('/all', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/videos — admin (JSON for external link)
router.post('/', requireAuth, async (req, res) => {
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
  res.status(201).json(data);
});

// POST /api/videos/upload — admin (file upload)
router.post('/upload', requireAuth, upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  const { title, description, thumbnail_url, published } = req.body;

  const { data, error } = await supabase
    .from('videos')
    .insert({
      title: title || req.file.originalname,
      description: description || '',
      file_path: `/uploads/${req.file.filename}`,
      is_external: false,
      thumbnail_url: thumbnail_url || '',
      published: published !== false,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/videos/reorder — admin
router.put('/reorder', requireAuth, async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order array required' });

  for (const { id, sort_order } of order) {
    const { error } = await supabase
      .from('videos')
      .update({ sort_order })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
  }
  res.json({ success: true });
});

// PUT /api/videos/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, video_url, thumbnail_url, published } = req.body;

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
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/videos/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
