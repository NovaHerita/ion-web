import { cors } from './_lib/auth.js';

export default function handler(req, res) {
  cors(res);
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}
