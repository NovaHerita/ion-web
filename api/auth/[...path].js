import supabase from '../_lib/supabase.js';
import { cors } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const rawPath = req.query['...path'] ?? req.query.path;
  const route = Array.isArray(rawPath) ? rawPath.join('/') : (rawPath || '');

  if (route === 'login' && req.method === 'POST') {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      token: data.session.access_token,
      email: data.user.email,
    });
  }

  if (route === 'verify') {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false });
    }

    const token = header.slice(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ valid: false });
    }

    return res.json({ valid: true });
  }

  res.status(404).json({ error: 'Not found' });
}
