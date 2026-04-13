import { Router } from 'express';
import supabase from '../db.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    token: data.session.access_token,
    email: data.user.email,
  });
});

// GET /api/auth/verify
router.get('/verify', async (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = header.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true });
});

export default router;
