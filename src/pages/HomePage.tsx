import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesColumn,
  Clock3,
  Cpu,
  MessagesSquare,
  PhoneCall,
  SearchCheck,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
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

const heroSignals = [
  { account: 'Fintech scale-up', detail: 'Series B hiring three GTM roles', state: 'Priority', tone: 'bg-emerald-300' },
  { account: 'Healthcare group', detail: 'New TA leadership and agency ramp', state: 'Queued', tone: 'bg-sky-300' },
  { account: 'PE-backed SaaS', detail: 'Expansion plan flagged across ANZ', state: 'Researching', tone: 'bg-amber-300' },
] as const;

const heroQueue = [
  { label: 'Reply triage', value: '14 active', width: '72%' },
  { label: 'Call briefs ready', value: '08 for today', width: '58%' },
  { label: 'Follow-up due', value: '03 overdue', width: '34%' },
] as const;

const heroMetrics = [
  { label: 'Live signal intake', value: 'Hiring events, role changes, account triggers' },
  { label: 'Desk control', value: 'Tasks, stages, and SLA-style follow-up logic' },
  { label: 'Commercial visibility', value: 'What moved, stalled, or needs action next' },
] as const;

const proofTiles = [
  { label: 'Built for', value: 'Recruiter teams', detail: 'Not a generic outbound template.' },
  { label: 'Delivery', value: 'Founder-led', detail: 'Strategy and execution stay in one loop.' },
  { label: 'Core system', value: 'Signal to follow-up', detail: 'Prospecting, outreach, calls, and CRM control.' },
  { label: 'Implementation', value: 'Custom workflow build', detail: 'Tuned to the desk, offer, and team structure.' },
] as const;

const operatingSystemCards = [
  {
    step: '01',
    title: 'Signal intake becomes a real operating layer',
    body:
      'Hiring signals, account relevance, and research rules feed the desk instead of each recruiter rebuilding a list from scratch.',
    points: ['Signal qualification rules', 'Research enrichment', 'Priority routing'],
    icon: SearchCheck,
  },
  {
    step: '02',
    title: 'Replies and calls create the next action automatically',
    body:
      'Outreach is only useful if replies convert cleanly into call briefs, task ownership, and follow-up windows the team can actually see.',
    points: ['Reply triage', 'Call queue design', 'Owner assignment'],
    icon: MessagesSquare,
  },
  {
    step: '03',
    title: 'Managers get visibility without drowning in admin',
    body:
      'Born turns pipeline movement into a controlled system so managers can see what is live, what is slipping, and what needs intervention next.',
    points: ['Stage logic', 'Overdue review', 'Conversion signals'],
    icon: ChartNoAxesColumn,
  },
] as const;

const featuredServices = services.slice(0, 3);
const secondaryCaseStudies = caseStudies.slice(1, 3);

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();

  usePageMeta(
    'Born | Custom recruiter systems for recruitment agencies',
    'Born designs bespoke recruiter software, hiring-signal workflows, call queues, and follow-up systems for recruitment agencies.',
  );

  const reveal = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.04,
      },
    },
  };

  return (
    <>
      <section className="site-section relative overflow-hidden pt-12">
        <div className="hero-noise absolute inset-0 -z-20 opacity-80" />
        <div className="hero-orb absolute left-[-8rem] top-[-5rem] -z-10 h-72 w-72" />
        <div className="hero-orb hero-orb-secondary absolute bottom-[-8rem] right-[-5rem] -z-10 h-80 w-80" />
        <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[85%] rounded-[3rem] opacity-35" />

        <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <motion.p variants={reveal} className="eyebrow">
              Custom recruiter systems
            </motion.p>
            <motion.h1
              variants={reveal}
              className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-[4.7rem]"
            >
              Bespoke recruiter software that makes business development feel controlled.
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Born builds the sourcing, research, outreach, call queue, CRM, and follow-up layer behind recruiter
              pipeline creation. The result is a custom operating system shaped around how your desk actually wins work.
            </motion.p>

            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryCta.to} className="cta-primary">
                {primaryCta.label}
              </Link>
              <Link to="/services" className="cta-secondary">
                Explore Services
              </Link>
              <Link to="/case-studies" className="cta-text">
                View Case Studies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div variants={reveal} className="mt-10 grid gap-4 sm:grid-cols-2">
              {proofTiles.slice(0, 2).map((tile) => (
                <div key={tile.label} className="metric-tile">
                  <p className="meta-kicker">{tile.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{tile.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tile.detail}</p>
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

          <motion.aside
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="hero-stage"
          >
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="meta-kicker text-emerald-200">Recruiter operating layer</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                    One system for signal intake, outreach, calls, and follow-up.
                  </h2>
                </div>
                <div className="hero-metric">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/65">Status</p>
                  <p className="mt-2 text-sm font-semibold text-white">Desk running live</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 xl:grid-cols-[0.56fr_0.44fr]">
                <div className="instrument-panel">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                        Signal intake
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">Accounts entering the desk today</p>
                    </div>
                    <SearchCheck className="h-5 w-5 text-emerald-200" />
                  </div>

                  <div className="mt-4 grid gap-3">
                    {heroSignals.map((signal) => (
                      <div key={signal.account} className="signal-row">
                        <div className="flex items-start gap-3">
                          <span className={`signal-dot ${signal.tone}`} />
                          <div>
                            <p className="text-sm font-semibold text-white">{signal.account}</p>
                            <p className="mt-1 text-sm text-stone-100/62">{signal.detail}</p>
                          </div>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-stone-100/76">
                          {signal.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="instrument-panel">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                          Queue health
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">What needs attention next</p>
                      </div>
                      <PhoneCall className="h-5 w-5 text-emerald-200" />
                    </div>
                    <div className="mt-4">
                      {heroQueue.map((item) => (
                        <div key={item.label} className="mt-4 first:mt-0">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-stone-100/72">{item.label}</span>
                            <span className="font-semibold text-white">{item.value}</span>
                          </div>
                          <div className="queue-line">
                            <span style={{ width: item.width }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="instrument-panel">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-emerald-200" />
                      <p className="text-sm font-semibold text-white">Automation rules and stage logic stay visible.</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-stone-100/76">
                        Reply routing
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-stone-100/76">
                        Call prep
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-stone-100/76">
                        SLA follow-up
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="hero-metric">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/60">{metric.label}</p>
                    <p className="mt-3 text-sm leading-6 text-stone-100/78">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="site-section-tight">
        <div className="section-slab">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Why the offer feels premium</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Born is selling a recruiter operating system, not a prettier version of manual admin.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-700">
              The commercial story is stronger when buyers can see the workflow scope, the implementation depth, and
              the control layer that sits behind each conversation.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {proofTiles.map((tile) => (
              <article key={tile.label} className="metric-tile h-full">
                <p className="meta-kicker">{tile.label}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{tile.value}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tile.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="dark-slab relative overflow-hidden">
          <div className="hero-orb absolute right-[-8rem] top-[-4rem] h-64 w-64 opacity-45" />
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">How the system works</p>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white">
                The page now shows what Born actually builds instead of repeating category copy in more cards.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-stone-100/72">
                Each layer of the operating model answers a buyer question: where accounts come from, how recruiters
                act on them, and how follow-up stays controlled after the first response.
              </p>

              <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/7 p-6">
                <div className="flex items-center gap-3">
                  <Workflow className="h-5 w-5 text-emerald-200" />
                  <p className="text-sm font-semibold text-white">Core workflow inside the desk</p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {homePillars.map((pillar) => (
                    <div key={pillar.title} className="rounded-[1.35rem] border border-white/8 bg-[#0f241c] px-4 py-4">
                      <p className="text-sm font-semibold text-white">{pillar.title}</p>
                      <p className="mt-2 text-sm leading-6 text-stone-100/62">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {operatingSystemCards.map(({ step, title, body, points, icon: Icon }) => (
                <article key={title} className="story-card">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/60">
                          Layer {step}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h3>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-stone-100/72">
                      Operating rule
                    </span>
                  </div>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-100/70">{body}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {points.map((point) => (
                      <span key={point} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-stone-100/72">
                        {point}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section border-t border-border/70">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Service architecture"
            title="The offer is clearer when each capability looks like part of one build system."
            description="Born should read like a premium recruiter infrastructure company. The homepage now frames service lines as connected modules inside one operating layer."
          />
          <LinkArrow to="/services">View all services</LinkArrow>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="surface-panel p-8 lg:p-10">
            <p className="meta-kicker">Featured build</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Recruiter System Architecture holds the whole workflow together.
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
              This is the highest-signal service because it shows Born is capable of designing the entire operating
              layer, not just one narrow activity stream.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {services[0].includes.slice(0, 4).map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-border/80 bg-white/90 px-5 py-5">
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {services[0].outcomes.map((outcome) => (
                <span key={outcome} className="proof-chip">
                  <ShieldCheck className="h-4 w-4" />
                  {outcome}
                </span>
              ))}
            </div>
          </article>

          <div className="grid gap-5">
            {featuredServices.map((service) => (
              <article key={service.slug} className="capability-card">
                <p className="meta-kicker">Service line</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{service.summary}</p>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                  {service.outcomes.slice(0, 2).map((outcome) => (
                    <li key={outcome} className="rounded-[1.2rem] border border-primary/10 bg-primary/5 px-4 py-3">
                      {outcome}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <LinkArrow to={`/services/${service.slug}`}>See service detail</LinkArrow>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="section-slab">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionIntro
              eyebrow="Process"
              title="Bespoke work lands better when the operating model is explicit."
              description="This section now behaves more like a delivery blueprint. Each stage explains what happens and what a client gets out of it."
            />
            <LinkArrow to="/process">See the full process</LinkArrow>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {processStages.map((stage, index) => (
              <article key={stage.name} className="capability-card bg-white/88">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <Clock3 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{stage.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{stage.summary}</p>
                <p className="mt-4 rounded-[1.25rem] border border-primary/10 bg-primary/5 px-4 py-4 text-sm leading-6 text-primary">
                  {stage.output}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section border-t border-border/70">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="dark-panel p-8 lg:p-10">
            <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">Proof</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white">
              Case studies now read like workflow change, not generic project summaries.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100/74">
              The strongest proof for Born is what got built, what changed operationally, and how that gave the desk
              more control after launch.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-[0.56fr_0.44fr]">
              <div className="rounded-[1.7rem] border border-white/10 bg-white/6 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                  {caseStudies[0].clientType}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{caseStudies[0].title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-100/70">{caseStudies[0].problem}</p>
                <p className="mt-4 rounded-[1.25rem] border border-white/10 bg-[#11271e] px-4 py-4 text-sm leading-6 text-stone-100/78">
                  <strong className="font-semibold text-white">Workflow delivered:</strong> {caseStudies[0].workflow}
                </p>
              </div>

              <div className="rounded-[1.7rem] border border-white/10 bg-white/6 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/60">Outcome</p>
                <p className="mt-4 text-sm leading-7 text-stone-100/74">{caseStudies[0].outcome}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {caseStudies[0].build.slice(0, 3).map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-stone-100/74">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    to={`/case-studies/${caseStudies[0].slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:gap-3"
                  >
                    Read case study
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            {secondaryCaseStudies.map((study) => (
              <article key={study.slug} className="capability-card h-full">
                <p className="meta-kicker">{study.clientType}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{study.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{study.summary}</p>
                <div className="mt-5 rounded-[1.4rem] border border-border/80 bg-white/90 px-4 py-4 text-sm leading-7 text-slate-700">
                  <strong className="font-semibold text-slate-950">Takeaway:</strong> {study.takeaway}
                </div>
                <div className="mt-5">
                  <LinkArrow to={`/case-studies/${study.slug}`}>Open case study</LinkArrow>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr]">
          <div className="section-copy">
            <p className="eyebrow">Who it is for</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The offer gets more believable when the audience is specific.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Born is strongest with recruiter teams that already know the desk is too dependent on manual sourcing,
              inconsistent outreach handling, or memory-driven follow-up.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audienceCards.map((card) => (
              <article key={card.title} className="capability-card">
                <p className="meta-kicker">Audience</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section border-t border-border/70">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="section-copy">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Serious buyers usually want to know the commercial shape, not just the promise.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The FAQ stays direct and practical so prospects can self-qualify before they book an audit.
            </p>
            <div className="mt-6 rounded-[1.6rem] border border-primary/10 bg-primary/5 px-5 py-5 text-sm leading-7 text-slate-700">
              The aim is not to answer everything. It is to remove vague uncertainty and make the next conversation more relevant.
            </div>
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
        title="If the desk is producing activity without enough control, Born can map what to fix first."
        description="The fastest next step is a recruiter systems audit. Born can diagnose whether the issue sits in signal intake, outreach handling, call workflow, or follow-up discipline and then show what the operating layer should look like."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
