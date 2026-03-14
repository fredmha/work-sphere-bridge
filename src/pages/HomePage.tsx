import { FormEvent, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BadgeCheck, MessagesSquare, SearchCheck, ShieldCheck, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SectionIntro } from '@/components/MarketingPrimitives';
import { faqItems, primaryCta, trustPoints } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

const heroQueue = [
  {
    company: 'Series A fintech recruiter',
    detail: 'New finance roles live, 41 staff, founder-led',
    nextAction: 'Call queued for this morning',
    tone: 'bg-emerald-300',
  },
  {
    company: 'Construction staffing agency',
    detail: 'Hiring ads active across NSW, director contact researched',
    nextAction: 'Email sent, SMS queued, call this afternoon',
    tone: 'bg-emerald-400',
  },
  {
    company: 'Accounting specialist firm',
    detail: 'Headcount up 28%, multiple live roles in your niche',
    nextAction: 'Callback set, follow-up running automatically',
    tone: 'bg-lime-300',
  },
] as const;

const systemSteps = [
  {
    title: 'We find the prospects',
    description:
      'Born sources hiring signals, job ads, and headcount movement, then delivers qualified accounts with decision-maker research every day.',
    icon: SearchCheck,
  },
  {
    title: 'Warm outreach runs before you call',
    description:
      'Each prospect gets tailored email and SMS outreach before you ever pick up the phone, so your name is already familiar when you call.',
    icon: MessagesSquare,
  },
  {
    title: 'You make the calls. The system handles the rest.',
    description:
      'After each conversation, dispositions trigger follow-up, nurture, callbacks, and pipeline updates automatically.',
    icon: Workflow,
  },
] as const;

const deliverables = [
  'Prospecting engine: automated sourcing from job boards, hiring signals, and headcount data with daily researched accounts.',
  'Branded outreach sequences: email and SMS written with you, in your tone, from a protected secondary domain.',
  'Daily call queue: prioritised prospects each morning with research displayed and one-click calling.',
  'Disposition-based automations: follow-up, nurture, callbacks, and pipeline updates handled after every call.',
  'Centralised pipeline: every contact, conversation, and outcome in one place.',
  'Weekly strategy call: 30 to 45 minutes to review data, adjust targeting, and tighten messaging.',
  'Ongoing optimisation: the system gets tuned against real conversation data, not left to drift.',
] as const;

const fitPoints = [
  'You are a founder, director, or MD still running part of BD yourself.',
  'You recruit in tech, accounting, finance, construction, marketing, or temp staffing.',
  'Your BD drops off when delivery gets heavy.',
  'You are still building lists by hand on Seek, LinkedIn, or job boards.',
  'Warm leads go cold because follow-up depends on remembering.',
  'You know outbound works but do not have the infrastructure to run it consistently.',
] as const;

const notFitPoints = [
  'You want outsourced calling. Born builds the system. You make the calls.',
  'You need a one-off project with no ongoing relationship.',
  'You are looking for a cheap dialer tool rather than a full outbound system.',
] as const;

const launchSteps = [
  'We pull 5 researched prospects in your niche before the call.',
  'On the call, we walk through your current BD process and show how the system would work for your firm.',
  'If there is a fit, we build the queue, outreach, pipeline, and follow-up around your market.',
] as const;

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

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  usePageMeta({
    title: 'Born | Bespoke outbound systems for recruitment firms',
    description:
      'Get 5 researched prospects and see how Born builds prospecting, outreach, call workflow, and follow-up for recruitment firms.',
    path: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Born',
      url: 'https://born.directory/',
      description:
        'Born builds bespoke outbound systems for recruitment firms so prospecting, outreach, call workflow, and follow-up run in one system.',
      email: 'fred@born.directory',
      areaServed: 'Australia',
    },
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

  const reveal = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: prefersReducedMotion ? 0 : 0.03,
      },
    },
  };

  return (
    <>
      <section className="site-section relative overflow-hidden pt-12">
        <div className="hero-noise absolute inset-0 -z-20 opacity-45" />
        <div className="hero-orb absolute left-[-10rem] top-[-6rem] -z-10 h-72 w-72" />
        <div className="hero-orb hero-orb-secondary absolute bottom-[-8rem] right-[-6rem] -z-10 h-80 w-80" />
        <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[82%] rounded-[2.9rem] opacity-25" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(20rem,1.06fr)] lg:items-start lg:gap-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="relative z-10">
            <motion.p variants={reveal} className="eyebrow">
              Recruitment outbound systems
            </motion.p>
            <motion.h1
              variants={reveal}
              className="mt-6 max-w-4xl text-[clamp(3.2rem,8vw,5rem)] font-semibold leading-[0.93] tracking-tight text-slate-950"
            >
              Your next 5 clients are already hiring. We&apos;ll find them.
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
              Born builds bespoke outbound systems for recruitment firms so prospecting, outreach, call workflow, and
              follow-up run every day, not just when delivery is quiet.
            </motion.p>

            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <a href="#lead-form" className="cta-primary">
                {primaryCta.label}
              </a>
              <Link to="/process" className="cta-secondary">
                See How It Works
              </Link>
              <Link to="/services" className="cta-text">
                See what you get
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.p variants={reveal} className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              We&apos;ll pull 5 real prospects in your niche and walk you through the system on a short call.
            </motion.p>

            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              {trustPoints.map((point) => (
                <span key={point} className="proof-chip">
                  <BadgeCheck className="h-4 w-4" />
                  {point}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.aside initial="hidden" animate="visible" variants={reveal} className="hero-stage">
            <div className="relative z-10">
              <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">Daily queue</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-[2.3rem]">
                Every morning starts with researched prospects, not list building.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-100/76">
                The system finds firms already hiring, warms them up before you call, and keeps the next action moving
                after every conversation.
              </p>

              <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.02fr)_minmax(15rem,0.98fr)]">
                <div className="instrument-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/68">
                    Queue preview
                  </p>
                  <div className="mt-4 grid gap-3">
                    {heroQueue.map((item) => (
                      <div key={item.company} className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`signal-dot ${item.tone}`} />
                          <p className="text-sm font-semibold text-white">{item.company}</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-stone-100/72">{item.detail}</p>
                        <div className="mt-3 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/80">
                          {item.nextAction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="instrument-panel">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/68">
                      System flow
                    </p>
                    <div className="mt-4 grid gap-3">
                      {['Hiring signal', 'Research added', 'Email + SMS sent', 'Call queued', 'Follow-up automated'].map(
                        (step) => (
                          <div key={step} className="signal-row">
                            <p className="text-sm font-medium text-white">{step}</p>
                            <ArrowRight className="h-4 w-4 text-emerald-100/70" />
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/68">What changes</p>
                    <p className="mt-3 text-sm leading-7 text-stone-100/76">
                      Your BD runs every day, even when delivery is heavy. No spreadsheet chasing. No leads going cold
                      because somebody forgot to follow up.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="site-section">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="How It Works"
            title="One clear walkthrough, once."
            description="Every morning, you log in to a queue of researched prospects ready to call. After each call, the system handles the rest."
          />
          <Link to="/process" className="cta-text">
            See the full process
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="feature-grid mt-10">
          {systemSteps.map(({ title, description, icon: Icon }, index) => (
            <article key={title} className="capability-card">
              <div className="flex items-center justify-between gap-4">
                <span className="meta-kicker">Step {index + 1}</span>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/70">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="What You Get"
            title="The full system, end to end."
            description="Born does not sell three disconnected services. We build the full outbound system and keep it tuned."
          />
          <Link to="/services" className="cta-text">
            See service details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {deliverables.map((item) => {
            const [title, body] = item.split(': ');

            return (
              <article key={title} className="surface-panel p-7">
                <p className="meta-kicker">{title}</p>
                <p className="mt-4 text-sm leading-7 text-slate-700">{body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="section-copy">
            <p className="eyebrow">Who It&apos;s For</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built for recruitment firms that are tired of manual BD.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
              Born works best with agencies that have 1 to 20 people, are good at conversations, but do not have a
              consistent system for getting in front of the right prospects every day.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="capability-card">
              <p className="meta-kicker">You&apos;re a fit if</p>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
                {fitPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="dark-panel p-7">
              <div className="relative z-10">
                <p className="meta-kicker text-emerald-100/70">You&apos;re not a fit if</p>
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-stone-100/76">
                  {notFitPoints.map((item) => (
                    <li key={item} className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="site-section border-t border-border/70">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <article className="dark-panel p-8 lg:p-10">
            <div className="relative z-10">
              <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">Founder-led</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-white/10 bg-white/8 text-3xl font-semibold text-white">
                  F
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">Fred</p>
                  <p className="text-sm text-stone-100/70">Sydney, Australia</p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-stone-100/76">
                I built Born because most recruitment firms do not need more tools. They need a system that finds the
                right prospects, warms them up, and keeps follow-up moving after every call.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-100/76">
                Every engagement is founder-led. You work directly with me, not a VA or a junior account manager. The
                system gets built around your niche, your tone, and how you actually win work.
              </p>
            </div>
          </article>

          <article className="section-frame">
            <div className="relative z-10">
              <p className="eyebrow">The Guarantee</p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                200% ROI by month 3, or we keep working for free.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
                Born takes on 3 clients per quarter. Nothing is templated. If the numbers have not at least doubled
                your return by month 3, we keep working until they do.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  '3 clients per quarter',
                  'Founder-led delivery',
                  'Built around your existing tools',
                  'No templated campaigns',
                ].map((item) => (
                  <div key={item} className="list-card text-sm font-medium">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a href="#lead-form" className="cta-primary">
                  {primaryCta.label}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="site-section">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div className="section-copy">
            <p className="eyebrow">Common Questions</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Short answers to the things buyers usually ask first.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
              Keep it practical. The right buyers should be able to self-qualify quickly.
            </p>
          </div>

          <div className="grid gap-4">
            {faqItems.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="lead-form" className="site-section">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
          <article className="dark-panel p-8 lg:p-10">
            <div className="relative z-10">
              <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">Next step</p>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white">See what your pipeline could look like.</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100/76">
                We&apos;ll pull 5 real prospects in your niche, with decision-maker details and hiring signals, and walk
                you through the system on a short call. No pitch deck. No pressure.
              </p>

              <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/6 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/68">How it starts</p>
                <div className="mt-4 grid gap-3">
                  {launchSteps.map((step, index) => (
                    <div key={step} className="timeline-node">
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                          {index + 1}
                        </span>
                        <p className="text-sm leading-6 text-stone-100/76">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

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
                  placeholder="Tech, accounting, construction, temp staffing, plus anything slowing BD down right now."
                  rows={6}
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
              <p className="text-sm leading-6 text-slate-600">
                We&apos;ll use this to pull 5 prospects and make the call useful.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
