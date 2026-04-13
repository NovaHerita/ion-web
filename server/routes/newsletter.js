import { Router } from 'express';
import nodemailer from 'nodemailer';
import supabase from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

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

// POST /api/newsletter/send — admin
router.post('/send', requireAuth, async (req, res) => {
  const { subject, body } = req.body;

  if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and body are required' });
  }

  const { data: subscribers, error: fetchError } = await supabase
    .from('subscribers')
    .select('id, email, name')
    .eq('subscribed', true);

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  if (!subscribers || subscribers.length === 0) {
    return res.status(400).json({ error: 'No active subscribers' });
  }

  const transporter = createTransporter();
  let sentCount = 0;
  const errors = [];

  for (const sub of subscribers) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: sub.email,
        subject,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0d1b2a;">
            <div style="text-align: center; padding: 40px 0 24px;">
              <h1 style="font-size: 24px; font-weight: 600; margin: 0;">ION</h1>
              <p style="font-size: 11px; letter-spacing: 0.15em; color: #6b7a8d; margin-top: 4px;">INTEGRATIVE OPUS NEUROSCIENCE</p>
            </div>
            <div style="padding: 0 24px 40px; font-size: 15px; line-height: 1.75; color: #4a5568;">
              ${body}
            </div>
            <div style="border-top: 1px solid #e8ecf0; padding: 24px; text-align: center; font-size: 12px; color: #8a9ab0;">
              <p>You're receiving this because you subscribed to the ION newsletter.</p>
              <p style="margin-top: 8px;">
                <a href="#" style="color: #2a6b8a;">Unsubscribe</a>
              </p>
            </div>
          </div>
        `,
      });
      sentCount++;
    } catch (err) {
      errors.push({ email: sub.email, error: err.message });
    }
  }

  // Log the newsletter
  const { error: insertError } = await supabase
    .from('newsletters')
    .insert({ subject, body, sent_to_count: sentCount });

  if (insertError) console.error('Failed to log newsletter:', insertError.message);

  res.json({
    success: true,
    sent: sentCount,
    total: subscribers.length,
    errors: errors.length > 0 ? errors : undefined,
  });
});

// GET /api/newsletter/history — admin
router.get('/history', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('sent_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/newsletter/test — admin (send to self)
router.post('/test', requireAuth, async (req, res) => {
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
});

export default router;
