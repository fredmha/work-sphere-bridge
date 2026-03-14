export type ApiResponsePayload = {
  error?: string;
  message?: string;
  bookingUrl?: string;
};

const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/MVQlqGvEnaa7C3pDgNJL/webhook-trigger/486a3d18-313e-4fcf-8c7d-e2acabe884d8';

export type ContactFormPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

export async function submitLeadForm(payload: ContactFormPayload): Promise<ApiResponsePayload> {
  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      company: payload.company,
      message: payload.message,
      website: payload.website,
      source: 'born.directory',
      tag: 'new lead',
      submittedAt: new Date().toISOString(),
    }),
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    const text = await response.text();
    const trimmedText = text.trim();
    const looksLikeHtml = contentType.includes('text/html') || trimmedText.startsWith('<!DOCTYPE') || trimmedText.startsWith('<html');
    const error = looksLikeHtml
      ? 'GoHighLevel rejected the request with HTML instead of JSON.'
      : trimmedText || `GoHighLevel returned HTTP ${response.status}.`;

    throw new Error(error);
  }

  if (contentType.includes('application/json')) {
    return (await response.json()) as ApiResponsePayload;
  }

  return {};
}
