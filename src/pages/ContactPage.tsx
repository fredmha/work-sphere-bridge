import { FormEvent, useState } from 'react';

import { PageHero } from '@/components/MarketingPrimitives';
import { contactChecklist, contactExpectations, contactProcess, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

const initialState: ContactFormState = {
  name: '',
  email: '',
  company: '',
  message: '',
  website: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  usePageMeta({
    title: 'Contact | Born',
    description:
      'Get 5 researched prospects and see how Born would build your outbound system before the first call.',
    path: '/contact',
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? 'There was a problem submitting the brief.');
      }

      setStatus({
        tone: 'success',
        message: payload.message ?? 'Thanks. Born will review the brief and reply with the next step.',
      });
      setForm(initialState);
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'There was a problem submitting the brief.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get 5 researched prospects in your niche."
        description="Share a short brief about your firm, what you recruit, and where BD is getting stuck. Born uses that to pull live prospects and make the first conversation useful."
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
          <aside className="surface-panel p-7">
            <p className="meta-kicker">Best fit</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {contactChecklist.map((item) => (
                <li key={item} className="list-card">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 info-card">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">What happens next</p>
              <ol className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                {contactProcess.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 accent-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Expectations</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                <p>{contactExpectations.responseWindow}</p>
                <p>{contactExpectations.primaryChannel}</p>
                <p>{contactExpectations.qualifier}</p>
              </div>
              <a href="mailto:fred@born.directory" className="mt-4 inline-flex text-base font-semibold text-primary hover:text-primary/80">
                fred@born.directory
              </a>
            </div>
          </aside>

          <form className="outline-panel p-7" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                Name
                <input
                  className="input-shell"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-900">
                Work email
                <input
                  className="input-shell"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@firm.com"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-900 md:col-span-2">
                Company
                <input
                  className="input-shell"
                  value={form.company}
                  onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                  placeholder="Firm name"
                />
              </label>

              <label className="hidden" aria-hidden="true">
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-900 md:col-span-2">
                What type of recruiting do you do?
                <textarea
                  className="textarea-shell"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  placeholder="What you recruit, who you want more of as clients, and where BD is getting stuck."
                  rows={7}
                  required
                />
              </label>
            </div>

            {status && (
              <p
                className={`mt-5 rounded-[1.5rem] px-4 py-4 text-sm ${
                  status.tone === 'success'
                    ? 'border border-primary/10 bg-primary/5 text-slate-700'
                    : 'border border-red-200 bg-red-50 text-red-700'
                }`}
                role="status"
              >
                {status.message}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" className="cta-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : primaryCta.label}
              </button>
              <p className="text-sm leading-6 text-slate-600">A short brief is enough. We&apos;ll use it to pull 5 prospects and make the next conversation useful.</p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
