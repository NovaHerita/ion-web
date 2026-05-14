import crypto from 'crypto';
import supabase from '../_lib/supabase.js';
import { requireAuth, cors } from '../_lib/auth.js';

async function mailchimpUpsert({ email, name, consentText, ip }) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !serverPrefix) {
    throw new Error('Mailchimp is not configured');
  }

  const emailHash = crypto
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex');

  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${emailHash}`;

  const body = {
    email_address: email,
    status_if_new: 'subscribed',
    status: 'subscribed',
    merge_fields: name ? { FNAME: name } : undefined,
    marketing_permissions: undefined,
    ip_signup: ip || undefined,
    timestamp_signup: new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, ''),
  };

  if (consentText) {
    body.tags = ['gdpr-consent'];
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const rawPath = req.query['...path'] ?? req.query.path;
  const raw = Array.isArray(rawPath) ? rawPath : (rawPath ? rawPath.split('/') : []);
  // The bare path /api/subscribers is rewritten to /api/subscribers/__root via vercel.json
  const parts = raw[0] === '__root' ? raw.slice(1) : raw;

  // POST /api/subscribers — public subscribe (Mailchimp)
  if (parts.length === 0 && req.method === 'POST') {
    const { email, name, consent, consentText } = req.body || {};

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    if (consent !== true) {
      return res.status(400).json({ error: 'GDPR consent is required to subscribe' });
    }

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;

    try {
      const { ok, status, data } = await mailchimpUpsert({
        email,
        name,
        consentText: consentText || 'User confirmed GDPR consent on newsletter signup form',
        ip,
      });

      if (ok) {
        return res.status(201).json({ message: 'Successfully subscribed!' });
      }

      console.error('Mailchimp error:', status, JSON.stringify(data, null, 2));

      if (status === 400 && data.title === 'Member Exists') {
        return res.json({ message: 'Already subscribed' });
      }
      if (status === 400 && /looks fake/i.test(data.detail || '')) {
        return res.status(400).json({ error: 'Please use a valid email address' });
      }
      if (status === 400 && data.detail) {
        return res.status(400).json({ error: data.detail });
      }

      return res.status(502).json({ error: 'Subscription service unavailable. Please try again later.' });
    } catch (err) {
      console.error('Mailchimp request failed:', err);
      return res.status(500).json({ error: err.message || 'Subscription failed' });
    }
  }

  // GET /api/subscribers — admin list
  if (parts.length === 0 && req.method === 'GET') {
    if (!(await requireAuth(req, res))) return;

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const stats = {
      total: subscribers.length,
      active: subscribers.filter((s) => s.subscribed).length,
      unsubscribed: subscribers.filter((s) => !s.subscribed).length,
    };

    return res.json({ subscribers, stats });
  }

  const id = parts[0];

  // POST /api/subscribers/:id/unsubscribe
  if (parts.length === 2 && parts[1] === 'unsubscribe' && req.method === 'POST') {
    const { error } = await supabase
      .from('subscribers')
      .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ message: 'Unsubscribed successfully' });
  }

  // DELETE /api/subscribers/:id
  if (req.method === 'DELETE') {
    if (!(await requireAuth(req, res))) return;

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
