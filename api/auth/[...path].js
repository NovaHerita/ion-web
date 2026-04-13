import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cors } from '../_lib/auth.js';

let adminHash = null;

function getAdminHash() {
  if (!adminHash) {
    adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin', 10);
  }
  return adminHash;
}

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const route = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;

  if (route === 'login' && req.method === 'POST') {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!bcrypt.compareSync(password, getAdminHash())) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ token, email });
  }

  if (route === 'verify') {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false });
    }

    try {
      jwt.verify(header.slice(7), process.env.JWT_SECRET);
      return res.json({ valid: true });
    } catch {
      return res.status(401).json({ valid: false });
    }
  }

  res.status(404).json({ error: 'Not found' });
}
