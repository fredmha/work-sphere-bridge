import { useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, type InsightItem } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function InsightDetailPage({ items }: { items: readonly InsightItem[] }) {
  const { slug } = useParams();
  const item = items.find((entry) => entry.slug === slug);

  if (!item) return <NotFound />;

  usePageMeta(`${item.title} | Born`, item.summary);

  return (
    <>
      <PageHero
        eyebrow={item.topic}
        title={item.title}
        description={item.summary}
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Back to Insights', to: '/insights' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="surface-panel p-7">
            <p className="meta-kicker">Key takeaways</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.takeaways.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </aside>

          <article className="outline-panel p-7">
            <div className="article-prose">
              {item.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>

      <CtaBand
        title="If this article reflects your bottleneck, Born can help fix the recruiter workflow behind it."
        description="The point of the insight layer is practical clarity. The next step is to map that clarity onto your actual recruiter pipeline setup."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
