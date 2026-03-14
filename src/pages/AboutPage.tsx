import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { aboutPrinciples, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta({
    title: 'About | Born',
    description:
      'Learn why Born exists, what it believes about recruiter workflow, and why its approach is high-touch, bespoke, and systems-led.',
    path: '/about',
  });

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Born exists to make recruiter business development feel more controlled and easier to run."
        description="Most agencies do not need more software noise. They need a clearer operating system for prospecting, replies, calls, and follow-up."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Process', to: '/process' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <article className="surface-panel p-7">
            <p className="meta-kicker">Why Born exists</p>
            <div className="mt-5 grid gap-4 text-base leading-7 text-slate-700">
              <p>
                Too much recruiter business development is treated like an activity problem when it is really a systems
                problem. Signals are weak, context is inconsistent, and follow-up is too dependent on memory.
              </p>
              <p>
                Born exists to correct that with bespoke workflow design and implementation. The work stays close to the
                desk because revenue-critical process should not be reduced to a generic retainer template.
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
              Born stays close to the workflow details that affect pipeline quality and follow-up discipline.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Bespoke</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The build adapts to the desk, the offer, and the team&apos;s operating reality instead of forcing a generic playbook.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Implementation-led</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Strategy matters only if it becomes a working system that recruiters can actually run.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="If that approach sounds like how you want your recruiter pipeline to run, Born is worth talking to."
        description="The best-fit agencies usually want clarity, control, and a system they can trust with revenue-critical work."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'View Services', to: '/services' }}
      />
    </>
  );
}
