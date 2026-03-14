import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().min(20).max(4000),
  website: z.string().trim().max(200).optional().default(''),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Please complete the form with a valid work email and a short workflow brief.' });
  }

  const submission = parsed.data;

  if (submission.website) {
    return res.status(200).json({ message: 'Thanks. Born will review the brief and reply if there is a fit.' });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(503).json({ error: 'The contact workflow is not configured yet. Email hello@born.systems instead.' });
  }

  const forwardedPayload = {
    source: 'born.systems',
    submittedAt: new Date().toISOString(),
    name: submission.name,
    email: submission.email,
    company: submission.company,
    message: submission.message,
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  if (process.env.CONTACT_WEBHOOK_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${process.env.CONTACT_WEBHOOK_BEARER_TOKEN}`;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(forwardedPayload),
  });

  if (!response.ok) {
    return res.status(502).json({ error: 'The brief could not be forwarded. Email hello@born.systems instead.' });
  }

  return res.status(200).json({
    message: 'Thanks. Born will review the brief and reply with the next step.',
  });
}
