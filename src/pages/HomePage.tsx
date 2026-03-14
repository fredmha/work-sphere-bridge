import { ArrowRight, ChartNoAxesColumn, Clock3, Cpu, MessagesSquare, PhoneCall, SearchCheck } from 'lucide-react';
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

const workflowSteps = [
  { label: 'Hiring signal detected', icon: SearchCheck },
  { label: 'Account context prepared', icon: Cpu },
  { label: 'Recruiter outreach launched', icon: MessagesSquare },
  { label: 'Call brief queued', icon: PhoneCall },
  { label: 'Follow-up controlled', icon: ChartNoAxesColumn },
] as const;

const workflowNotes = [
  {
    title: 'Signal intake',
    body: 'Live hiring events and account rules decide what enters the queue instead of ad hoc list building.',
  },
  {
    title: 'Recruiter action',
    body: 'Each reply or call creates the next task, owner, and timing automatically.',
  },
  {
    title: 'Management visibility',
    body: 'Pipeline stages and overdue actions stay visible without turning the system into admin theatre.',
  },
] as const;

export default function HomePage() {
  usePageMeta(
    'Born | Custom recruiter systems for recruitment agencies',
    'Born designs bespoke recruiter software, hiring-signal workflows, call queues, and follow-up systems for recruitment agencies.',
  );

  return (
    <>
      <section className="site-section relative overflow-hidden pt-12">
        <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[86%] rounded-[2.75rem] opacity-35" />
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="eyebrow">Custom recruiter systems</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-[4.35rem]">
              Bespoke recruiter software and workflows for agencies that want cleaner pipeline.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Born designs the sourcing, outreach, call queue, CRM, and follow-up layer behind recruiter business
              development. The result is a custom system built around how your desk actually wins work.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryCta.to} className="cta-primary">
                {primaryCta.label}
              </Link>
              <Link to="/services" className="cta-secondary">
                See Services
              </Link>
              <Link to="/case-studies" className="cta-text">
                View Case Studies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {trustPoints.map((point) => (
                <span key={point} className="label-chip">
                  {point}
                </span>
              ))}
            </div>
          </div>

          <aside className="surface-panel p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="meta-kicker">Recruiter workflow view</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">A recruiter system, not another fragile stack</h2>
              </div>
              <span className="rounded-full border border-primary/10 bg-white/80 px-3 py-1 text-xs font-semibold text-primary">
                Bespoke build
              </span>
            </div>

            <div className="mt-8 grid gap-4">
              {workflowSteps.map(({ label, icon: Icon }, index) => (
                <div key={label} className="flex items-center gap-4 rounded-[1.5rem] border border-border/70 bg-white/90 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_12px_24px_rgba(19,39,31,0.18)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {workflowNotes.map((note) => (
                <div key={note.title} className="accent-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{note.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{note.body}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-border/80 bg-white/70">
        <div className="container-shell grid gap-4 py-5 sm:grid-cols-2 xl:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point} className="flex items-center gap-3 rounded-2xl border border-border bg-white/92 px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="site-section">
        <SectionIntro
          eyebrow="What Born builds"
          title="Born sells recruiter infrastructure, not another outsourced activity package."
          description="The offer is bespoke by design. Born builds the sourcing, messaging, workflow, call prep, and follow-up layer that turns recruiter business development into a controlled operating system."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {homePillars.map((pillar) => (
            <article key={pillar.title} className="surface-panel p-7">
              <p className="meta-kicker">Core pillar</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{pillar.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <SectionIntro
          eyebrow="Who it is for"
          title="Built for recruiter teams with real commercial complexity."
          description="Born is for recruitment agencies that need their sourcing, outreach, calls, and follow-up to run like one coherent system instead of separate habits."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {audienceCards.map((card) => (
            <article key={card.title} className="outline-panel p-6">
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Services"
            title="Service lines that sound like custom systems work, because that is what they are."
            description="Each service is tied to a recruiter operating problem: weak signal intake, messy outreach, poor call prep, or no real control after the first conversation."
          />
          <LinkArrow to="/services">View all services</LinkArrow>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="surface-panel p-7">
              <p className="meta-kicker">Service line</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{service.summary}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="accent-card text-sm text-slate-700">
                    {outcome}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LinkArrow to={`/services/${service.slug}`}>See service detail</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Process"
            title="A delivery model that makes the bespoke work feel concrete."
            description="Buyers can see how Born audits the desk, designs the workflow, builds the system, launches it, and improves it with live recruiter feedback."
          />
          <LinkArrow to="/process">View the full process</LinkArrow>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-5">
          {processStages.map((stage, index) => (
            <article key={stage.name} className="outline-panel p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Stage {index + 1}</p>
                <Clock3 className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{stage.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{stage.summary}</p>
              <p className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-primary">{stage.output}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Proof"
            title="Case studies built around workflow change, not empty vanity metrics."
            description="The proof layer shows what Born built for recruiter teams, how the operating system changed, and where control improved after implementation."
          />
          <LinkArrow to="/case-studies">Browse all case studies</LinkArrow>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.slug} className="surface-panel p-7">
              <p className="meta-kicker">{study.clientType}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{study.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{study.summary}</p>
              <div className="mt-5 rounded-[1.5rem] border border-border bg-white/82 p-4 text-sm leading-7 text-slate-700">
                <strong className="font-semibold text-slate-950">Outcome:</strong> {study.outcome}
              </div>
              <div className="mt-6">
                <LinkArrow to={`/case-studies/${study.slug}`}>Read case study</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <SectionIntro
          eyebrow="FAQ"
          title="Clear answers for recruiter buyers who want specifics."
          description="The homepage should make it easy to understand whether Born is a fit before anyone books an audit."
        />
        <div className="mt-10 grid gap-4">
          {faqItems.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBand
        title="If recruiter business development feels too manual, this is the conversation to have."
        description="Book a recruiter systems audit if you want a more bespoke workflow, less admin, and tighter control over how new opportunities get worked."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Read an Insight', to: '/insights' }}
      />
    </>
  );
}
