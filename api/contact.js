import { z } from 'zod';

const bookingUrl = 'https://calendar.app.google/ojKcFNdBimFU2JoF6';
const GHL_VERSION = '2021-07-28';
const GHL_DEFAULT_BASE = 'https://services.leadconnectorhq.com';
const CONTACT_TAG = 'new lead';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().min(20).max(4000),
  website: z.string().trim().max(200).optional().default(''),
});

function splitName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const [firstName = '', ...rest] = parts;

  return {
    firstName,
    lastName: rest.join(' '),
  };
}

function getGhlBaseUrl() {
  const base = process.env.GHL_API_BASE?.trim() || GHL_DEFAULT_BASE;
  return base.replace(/\/+$/, '');
}

async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function getErrorMessage(payload, fallback) {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const candidates = [
    payload.message,
    payload.error,
    payload.msg,
    payload.errors?.[0]?.message,
    payload.errors?.message,
    payload.meta?.message,
  ];

  return candidates.find((value) => typeof value === 'string' && value.trim()) || fallback;
}

function getContactId(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const candidates = [
    payload.id,
    payload._id,
    payload.contactId,
    payload.contact?.id,
    payload.contact?._id,
    payload.contact?.contactId,
    payload.data?.id,
    payload.data?._id,
    payload.data?.contactId,
    payload.data?.contact?.id,
    payload.data?.contact?._id,
    payload.data?.contact?.contactId,
  ];

  return candidates.find((value) => typeof value === 'string' && value.trim()) || null;
}

async function upsertGhlContact(submission) {
  const apiKey = process.env.GHL_API_KEY?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();

  if (!apiKey || !locationId) {
    throw new Error('The contact workflow is not configured yet. Add GHL_API_KEY and GHL_LOCATION_ID.');
  }

  const { firstName, lastName } = splitName(submission.name);
  const payload = {
    locationId,
    firstName,
    lastName,
    name: submission.name,
    email: submission.email,
    companyName: submission.company || undefined,
    source: 'born.directory',
    tags: [CONTACT_TAG],
  };

  const response = await fetch(`${getGhlBaseUrl()}/contacts/upsert`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Version: GHL_VERSION,
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(responsePayload, 'The brief could not be sent to GoHighLevel.'));
  }

  const contactId = getContactId(responsePayload);

  if (!contactId) {
    throw new Error('GoHighLevel did not return a contact id for the submitted brief.');
  }

  return { contactId };
}

async function createGhlNote(contactId, submission) {
  const apiKey = process.env.GHL_API_KEY?.trim();

  if (!apiKey) {
    return;
  }

  const noteBody = [
    'Born website brief',
    `Submitted at: ${new Date().toISOString()}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company || 'Not provided'}`,
    '',
    submission.message,
  ].join('\n');

  const response = await fetch(`${getGhlBaseUrl()}/contacts/${contactId}/notes`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Version: GHL_VERSION,
    },
    body: JSON.stringify({ body: noteBody }),
  });

  if (!response.ok) {
    const payload = await parseApiResponse(response);
    throw new Error(getErrorMessage(payload, 'The contact was created in GoHighLevel, but the form brief note could not be added.'));
  }
}

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
    return res.status(200).json({ message: 'Thanks. Redirecting you to booking now.', bookingUrl });
  }

  try {
    const { contactId } = await upsertGhlContact(submission);
    await createGhlNote(contactId, submission);
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : 'The brief could not be sent to GoHighLevel. Email fred@born.directory instead.',
    });
  }

  return res.status(200).json({
    message: 'Thanks. Redirecting you to booking now.',
    bookingUrl,
  });
}
