import { useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import type { IndustryItem } from '@/content/bornSiteContent';
import { primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function IndustryDetailPage({ items }: { items: readonly IndustryItem[] }) {
  const { slug } = useParams();
  const item = items.find((entry) => entry.slug === slug);

  usePageMeta(item ? `${item.title} | Born` : 'Use case detail | Born', item?.summary ?? 'Explore Born use cases.');

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
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </article>

          <article className="outline-panel p-7">
            <p className="meta-kicker">What Born builds</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.buildFocus.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </article>

          <article className="surface-panel p-7">
            <p className="meta-kicker">Outcomes</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.outcomes.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <CtaBand
        title="Need a build shaped to your recruiter motion?"
        description="Born uses the same operating principles across agencies, but the workflow details are shaped around how your desk actually wins work."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
