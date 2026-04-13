import nodemailer from 'nodemailer';
import { requireAuth, cors } from '../_lib/auth.js';

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

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireAuth(req, res)) return;

  const { subject, body, testEmail } = req.body;

  if (!subject || !body || !testEmail) {
    return res.status(400).json({ error: 'Subject, body, and testEmail required' });
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: testEmail,
      subject: `[TEST] ${subject}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0d1b2a;">
          <div style="background: #fff3cd; padding: 12px 24px; text-align: center; font-size: 13px; color: #856404;">This is a test email</div>
          <div style="text-align: center; padding: 40px 0 24px;">
            <h1 style="font-size: 24px; font-weight: 600; margin: 0;">ION</h1>
            <p style="font-size: 11px; letter-spacing: 0.15em; color: #6b7a8d; margin-top: 4px;">INTEGRATIVE OPUS NEUROSCIENCE</p>
          </div>
          <div style="padding: 0 24px 40px; font-size: 15px; line-height: 1.75; color: #4a5568;">
            ${body}
          </div>
        </div>
      `,
    });
    res.json({ success: true, message: `Test email sent to ${testEmail}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
