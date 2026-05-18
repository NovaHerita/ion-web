import nodemailer from 'nodemailer';
import { cors } from './_lib/auth.js';

const RECIPIENTS = ['benjamin@ionbiofeedback.com', 'kasia@ionbiofeedback.com'];

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, email, enquiry } = req.body || {};

  if (!firstName || !lastName || !email || !enquiry) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const subject = `New consultation enquiry from ${fullName}`;
  const enquiryHtml = escapeHtml(enquiry).replace(/\n/g, '<br />');
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0d1b2a;">
      <div style="text-align: center; padding: 32px 0 16px;">
        <h1 style="font-size: 22px; font-weight: 600; margin: 0;">ION</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; color: #6b7a8d; margin-top: 4px;">NEW CONSULTATION ENQUIRY</p>
      </div>
      <div style="padding: 0 24px 32px; font-size: 15px; line-height: 1.75; color: #4a5568;">
        <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#2a6b8a;">${escapeHtml(email)}</a></p>
        <p style="margin-top: 24px;"><strong>Enquiry:</strong></p>
        <p style="background:#f5f7fa;padding:16px;border-radius:8px;">${enquiryHtml}</p>
      </div>
    </div>
  `;
  const text = `New consultation enquiry\n\nName: ${fullName}\nEmail: ${email}\n\nEnquiry:\n${enquiry}\n`;

  const transporter = createTransporter();
  const results = await Promise.allSettled(
    RECIPIENTS.map((to) =>
      transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        replyTo: email,
        subject,
        text,
        html,
      })
    )
  );

  const failures = results
    .map((r, i) => (r.status === 'rejected' ? { to: RECIPIENTS[i], error: r.reason?.message } : null))
    .filter(Boolean);

  if (failures.length === RECIPIENTS.length) {
    console.error('[contact] all sends failed', failures);
    const detail = failures[0]?.error || 'unknown error';
    return res.status(500).json({ error: `Could not send your enquiry: ${detail}` });
  }

  return res.json({ success: true, failures: failures.length ? failures : undefined });
}
