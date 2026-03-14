import { useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { insights, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function InsightDetailPage() {
  const { slug } = useParams();
  const item = insights.find((entry) => entry.slug === slug);

  usePageMeta(
    item
      ? {
          title: `${item.title} | Born`,
          description: item.summary,
          path: `/insights/${item.slug}`,
          type: 'article',
        }
      : { title: 'Insight detail | Born', description: 'Explore Born insights.', path: '/insights' },
  );

  if (!item) return <NotFound />;

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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
          <aside className="surface-panel p-7">
            <p className="meta-kicker">Key takeaways</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.takeaways.map((entry) => (
                <li key={entry} className="list-card">
                  {entry}
                </li>
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
        description="The point of the insight layer is practical clarity. The next step is to map that clarity onto your actual recruiter pipeline."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
