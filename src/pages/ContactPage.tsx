import { FormEvent, useState } from 'react';

import { PageHero } from '@/components/MarketingPrimitives';
import { contactChecklist } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialState: ContactFormState = {
  name: '',
  email: '',
  company: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string | null>(null);

  usePageMeta(
    'Contact | Born',
    'Book a recruiter systems audit with Born to discuss bespoke recruiter software, sourcing workflow, and follow-up infrastructure.',
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Thanks. Born will use this brief to prepare a more relevant recruiter systems audit.');
    setForm(initialState);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Book a recruiter systems audit if the desk feels too manual."
        description="Keep the contact path friction-light. The goal is to make it obvious what happens next while giving Born enough context to prepare a useful recruiter conversation."
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
          <aside className="surface-panel p-7">
            <p className="meta-kicker">Best fit</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {contactChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="mt-8 rounded-[1.5rem] border border-primary/10 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Direct contact</p>
              <a href="mailto:hello@born.systems" className="mt-3 inline-flex text-base font-semibold text-primary hover:text-primary/80">
                hello@born.systems
              </a>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Sydney-based, working with recruitment firms that want bespoke recruiter systems rather than generic outbound retainers.
              </p>
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
                Recruitment firm
                <input
                  className="input-shell"
                  value={form.company}
                  onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                  placeholder="Firm name"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-900 md:col-span-2">
                What do you need help with?
                <textarea
                  className="textarea-shell"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Tell Born about your recruiter workflow, what kind of desk you run, and where sourcing, calls, or follow-up feel weak."
                  rows={7}
                  required
                />
              </label>
            </div>

            {status && (
              <p className="mt-5 rounded-[1.5rem] border border-primary/10 bg-primary/5 px-4 py-4 text-sm text-slate-700" role="status">
                {status}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" className="cta-primary">
                Request audit
              </button>
              <p className="text-sm leading-6 text-slate-600">No bloated form. Just enough context to make the audit useful.</p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
