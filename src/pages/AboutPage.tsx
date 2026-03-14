import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { aboutPrinciples, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta({
    title: 'About | Born',
    description:
      'Meet Fred and see why Born builds founder-led outbound systems for recruitment firms.',
    path: '/about',
  });

  return (
    <>
      <PageHero
        eyebrow="About"
        title="I built Born because most recruiters do not need more tools. They need a system."
        description="Most recruitment firms I speak to have the same problem: BD runs when there is time for it, then disappears when delivery gets heavy."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Process', to: '/process' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <article className="surface-panel p-7">
            <p className="meta-kicker">Why Born exists</p>
            <div className="mt-5 grid gap-4 text-base leading-7 text-slate-700">
              <p>
                Prospecting is manual, follow-up depends on memory, and warm leads go cold because nobody chased them.
                Most firms do not need more software noise. They need a system that keeps business development moving
                every day.
              </p>
              <p>
                That is what Born does. I build the prospecting, outreach, call queue, follow-up, and pipeline around
                how your firm actually wins work, then keep tuning it with you.
              </p>
              <p>You work directly with me on every engagement. No junior handoff. No VA layer.</p>
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
            <p className="meta-kicker">Founder-led</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              You work directly with Fred from the first call through delivery.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Built around your market</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The system gets shaped around your niche, your tone, and your current tools.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Guaranteed</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              If the numbers have not worked by month 3, Born keeps working for free until they do.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="If that sounds like the kind of help you want, the next step is simple."
        description="Book the call, see 5 researched prospects in your niche, and work out whether Born is the right fit."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Contact Born', to: '/contact' }}
      />
    </>
  );
}
