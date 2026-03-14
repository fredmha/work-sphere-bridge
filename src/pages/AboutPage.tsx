import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { aboutPrinciples, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta(
    'About | Born',
    'Learn why Born exists, what it believes about recruiter workflow, and why its approach is high-touch, bespoke, and systems-led.',
  );

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Born exists to make recruiter business development feel organised, useful, and commercially serious."
        description="The company is built around a simple belief: most recruitment firms do not need more software noise. They need a better operating system for signal intake, outreach, calling, and follow-up."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Process', to: '/process' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <article className="surface-panel p-7">
            <p className="meta-kicker">What Born believes</p>
            <div className="mt-5 grid gap-4 text-base leading-7 text-slate-700">
              <p>
                Too much recruiter business development is treated like an activity problem when it is really a systems
                problem. Signals are weak, context is inconsistent, follow-up is fragile, and pipeline stages mean
                different things to different recruiters.
              </p>
              <p>
                Born exists to correct that. The work is high-touch and bespoke because revenue-critical recruiter
                workflow should not be reduced to a generic retainer template.
              </p>
              <p>
                The result should feel closer to a premium recruiter infrastructure company than a traditional lead
                generation agency. Serious systems. Clear execution. No inflated promises.
              </p>
            </div>
          </article>

          <article className="outline-panel p-7">
            <p className="meta-kicker">Operating principles</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {aboutPrinciples.map((principle) => (
                <li key={principle} className="accent-card">
                  {principle}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="outline-panel p-7">
            <p className="meta-kicker">High-touch</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Born stays close to the details that actually affect recruiter pipeline: signals, call flow, stage logic,
              task routing, and review loops.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Bespoke</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The build adapts to the desk, the offer, and the team&apos;s operating reality rather than forcing a generic
              playbook.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Implementation-led</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Strategy matters, but only when it becomes a working recruiter workflow. Born focuses on that conversion
              from idea to operating system.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="If that approach matches how you want recruiter pipeline to run, Born is worth talking to."
        description="The best-fit agencies usually want clarity, control, and a system they can trust with revenue-critical work."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'View Services', to: '/services' }}
      />
    </>
  );
}
