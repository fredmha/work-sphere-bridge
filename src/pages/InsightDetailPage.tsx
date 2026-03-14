import { Link, useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { insights, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function InsightDetailPage() {
  const { slug } = useParams();
  const item = insights.find((entry) => entry.slug === slug);
  const relatedArticles = item
    ? (item.relatedSlugs ?? []).reduce<(typeof insights)[number][]>((accumulator, relatedSlug) => {
        const relatedItem = insights.find((entry) => entry.slug === relatedSlug);

        if (relatedItem) {
          accumulator.push(relatedItem);
        }

        return accumulator;
      }, [])
    : [];

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
              {item.sections.map((section, index) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                  {index === 1 && (
                    <div className="dark-slab mt-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/70">
                        Want this built for you?
                      </p>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-100/78">
                        If the workflow in this article sounds right but the implementation still feels messy, Born can
                        build it around your niche and current motion. The starting point is the same on every engagement:
                        5 researched prospects pulled before the first call, then the broader system build behind them.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link to="/contact" className="cta-primary">
                          Get 5 Researched Prospects Today
                        </Link>
                        <Link to="/services" className="cta-secondary">
                          See What You Get
                        </Link>
                      </div>
                    </div>
                  )}
                </section>
              ))}

              {relatedArticles.length > 0 && (
                <section className="mt-4 border-t border-border/80 pt-8">
                  <h2>Related reading</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {relatedArticles.map((article) => (
                      <Link key={article.slug} to={`/insights/${article.slug}`} className="accent-card block">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{article.topic}</p>
                        <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{article.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{article.summary}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        </div>
      </section>

      <CtaBand
        title="If this article reflects your bottleneck, Born can help fix the recruiter workflow behind it."
        description="The point of the insight layer is practical clarity. The next step is to map that clarity onto your actual outbound workflow and target companies."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Get the 5 prospects', to: '/contact' }}
      />
    </>
  );
}
