import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BadgeCheck, ChartNoAxesColumn, MessagesSquare, SearchCheck, ShieldCheck, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CtaBand, LinkArrow, SectionIntro } from '@/components/MarketingPrimitives';
import {
  audienceCards,
  caseStudies,
  faqItems,
  homePillars,
  primaryCta,
  processStages,
  services,
  trustPoints,
} from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

const operatingLayers = [
  {
    title: 'Signal intake',
    body: 'Capture the right hiring activity, qualify it, and route it into a live queue.',
    icon: SearchCheck,
  },
  {
    title: 'Reply routing',
    body: 'Turn replies into clear owner, context, and next-action rules.',
    icon: MessagesSquare,
  },
  {
    title: 'Follow-up control',
    body: 'Keep calls, tasks, and overdue actions visible after first contact.',
    icon: ChartNoAxesColumn,
  },
] as const;

const proofStrip = [
  'Built for recruiter teams, not generic outbound',
  'Founder-led delivery from audit through implementation',
  'Designed to work with the stack you already have',
] as const;

const featuredServices = services.slice(0, 3);
const featuredCaseStudies = caseStudies.slice(0, 3);
const compactProcess = processStages.slice(0, 3);

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();

  usePageMeta({
    title: 'Born | Custom recruiter systems for recruitment agencies',
    description:
      'Born builds custom recruiter systems for signal intake, outreach, call workflow, CRM structure, and follow-up control.',
    path: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Born',
      url: 'https://born.systems/',
      description:
        'Born builds custom recruiter systems for recruitment agencies that want tighter control over sourcing, replies, calls, and follow-up.',
      email: 'hello@born.systems',
      areaServed: 'Australia',
    },
  });

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
        <div className="hero-noise absolute inset-0 -z-20 opacity-40" />
        <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[82%] rounded-[2.75rem] opacity-20" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(20rem,1.06fr)] lg:items-center lg:gap-10">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.p variants={reveal} className="eyebrow">
              Recruiter systems
            </motion.p>
            <motion.h1
              variants={reveal}
              className="mt-6 max-w-4xl text-[clamp(3rem,8vw,4.5rem)] font-semibold leading-[0.97] tracking-tight text-slate-950"
            >
              Born builds the system behind recruiter pipeline.
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
              Signal intake, outreach, call workflow, CRM structure, and follow-up control designed around how your desk
              actually wins work.
            </motion.p>

            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryCta.to} className="cta-primary">
                {primaryCta.label}
              </Link>
              <Link to="/services" className="cta-secondary">
                See Services
              </Link>
              <Link to="/process" className="cta-text">
                See how the system works
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div variants={reveal} className="mt-8 grid gap-3 sm:grid-cols-2">
              {proofStrip.map((item) => (
                <div key={item} className="metric-tile">
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </motion.div>

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
              <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">What Born controls</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-[2.2rem]">
                One operating layer instead of tool sprawl and memory-driven follow-up.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-100/76">
                The goal is not more software. The goal is a calmer, cleaner system for what enters the desk, what
                happens next, and what gets chased properly.
              </p>

              <div className="mt-8 grid gap-4">
                {operatingLayers.map(({ title, body, icon: Icon }) => (
                  <article key={title} className="story-card bg-white/6">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="mt-2 text-sm leading-7 text-stone-100/70">{body}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/65">Buyer outcome</p>
                <p className="mt-3 text-sm leading-7 text-stone-100/76">
                  Recruiters get clearer daily execution. Managers get a system they can actually review and improve.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="site-section-tight">
        <div className="section-frame">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-center">
            <div>
              <p className="eyebrow">Why it lands</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Born should read like recruiter infrastructure, not a dressed-up service page.
              </h2>
            </div>
            <div className="detail-grid">
              {[
                'Clear scope instead of vague automation language',
                'Practical workflow design from prospecting through follow-up',
                'Category-specific logic for recruiter desks',
                'A premium feel built on control, not noise',
              ].map((item) => (
                <div key={item} className="list-card text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Core system"
            title="The offer is easier to trust when each workflow layer is obvious."
            description="Born helps agencies fix three recurring breakdowns: weak signal intake, messy reply handling, and inconsistent follow-up after live conversations."
          />
          <LinkArrow to="/process">See the process</LinkArrow>
        </div>

        <div className="feature-grid mt-10">
          {homePillars.map((pillar) => (
            <article key={pillar.title} className="surface-panel p-7">
              <p className="meta-kicker">Workflow layer</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{pillar.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/70">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <article className="dark-panel p-8 lg:p-10">
            <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">Services</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white">
              Start with the part of the desk that needs the most control.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100/74">
              Some teams need the whole operating model. Others need sourcing logic, reply routing, or tighter daily
              follow-up. The service structure makes that easier to diagnose.
            </p>

            <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-white/6 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/65">Flagship build</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{services[0].title}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-100/72">{services[0].businessEffect}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {services[0].outcomes.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-stone-100/76">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            {featuredServices.map((service) => (
              <article key={service.slug} className="capability-card">
                <div className="flex items-center justify-between gap-4">
                  <p className="meta-kicker">Service line</p>
                  <LinkArrow to={`/services/${service.slug}`}>Open</LinkArrow>
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{service.buyerFit}</p>
                <div className="mt-5 detail-grid">
                  <div className="info-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">System build</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{service.systemBuild}</p>
                  </div>
                  <div className="accent-panel">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business effect</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{service.businessEffect}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Proof"
            title="Case studies should explain what changed operationally."
            description="The strongest proof is not branding language. It is what got built, how the workflow changed, and what became easier to control afterward."
          />
          <LinkArrow to="/case-studies">View case studies</LinkArrow>
        </div>

        <div className="feature-grid mt-10">
          {featuredCaseStudies.map((study) => (
            <article key={study.slug} className="surface-panel p-7">
              <p className="meta-kicker">{study.clientType}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{study.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{study.problem}</p>
              <div className="mt-5 info-card">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">System built</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{study.systemBuild}</p>
              </div>
              <div className="mt-4 accent-panel">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business effect</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{study.businessEffect}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {study.whatChanged.map((item) => (
                  <span key={item} className="proof-chip">
                    <ShieldCheck className="h-4 w-4" />
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/70">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="section-copy">
            <p className="eyebrow">Who it is for</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The site is strongest when the buyer can self-qualify quickly.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Born fits firms that already know recruiter business development matters, but do not want the desk held
              together by spreadsheets, inboxes, and memory.
            </p>

            <div className="mt-8 accent-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">How the engagement starts</p>
              <div className="mt-4 grid gap-3">
                {compactProcess.map((stage, index) => (
                  <div key={stage.name} className="flex items-start gap-4 rounded-[1.2rem] bg-white/75 px-4 py-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{stage.name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{stage.output}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {audienceCards.map((card) => (
              <article key={card.title} className="capability-card">
                <p className="meta-kicker">Best fit</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div className="section-copy">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The FAQ should remove hesitation, not add more selling.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Keep the answers practical so the right buyers can move and the wrong buyers can self-select out.
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

      <CtaBand
        title="If the desk is producing activity without enough control, Born can help map what to fix first."
        description="The fastest next step is a recruiter systems audit. Born can diagnose whether the issue sits in signal intake, outreach handling, call workflow, or follow-up discipline."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
