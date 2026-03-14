import { useParams } from 'react-router-dom';

import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { industries, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function IndustryDetailPage() {
  const { slug } = useParams();
  const item = industries.find((entry) => entry.slug === slug);

  usePageMeta(
    item
      ? {
          title: `${item.title} | Born`,
          description: item.summary,
          path: `/industries/${item.slug}`,
        }
      : { title: 'Use case detail | Born', description: 'Explore Born use cases.', path: '/industries' },
  );

  if (!item) return <NotFound />;

  return (
    <>
      <PageHero
        eyebrow="Recruiter use case"
        title={item.title}
        description={item.summary}
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Back to Use Cases', to: '/industries' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="surface-panel p-7">
            <p className="meta-kicker">Pain points</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.painPoints.map((entry) => (
                <li key={entry} className="list-card">
                  {entry}
                </li>
              ))}
            </ul>
          </article>

          <article className="outline-panel p-7">
            <p className="meta-kicker">What Born builds</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.buildFocus.map((entry) => (
                <li key={entry} className="info-card">
                  {entry}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-panel p-7">
            <p className="meta-kicker">Outcomes</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.outcomes.map((entry) => (
                <li key={entry} className="accent-panel">
                  {entry}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: 'Relevant services',
              body: 'See which parts of the outbound system Born usually builds for this kind of team.',
              to: '/services',
              label: 'See services',
            },
            {
              title: 'How the rollout works',
              body: 'The 5-firm proof-of-concept is just the start. See how the full build is delivered.',
              to: '/process',
              label: 'See process',
            },
            {
              title: 'Book the first call',
              body: 'Share your niche and current workflow. Born will use that to pull the first 5 firms.',
              to: '/contact',
              label: 'Go to contact',
            },
          ].map((item) => (
            <article key={item.title} className="outline-panel p-7">
              <p className="meta-kicker">Next step</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{item.body}</p>
              <div className="mt-5">
                <LinkArrow to={item.to}>{item.label}</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Need a build shaped to your recruiter motion?"
        description="Born uses the same operating principles across agencies, but the workflow details are always shaped around how your team sells into firms."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
