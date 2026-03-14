import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { insights, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function InsightsPage() {
  usePageMeta(
    'Insights | Born',
    'Read practical Born resources on recruiter outbound systems, prospecting workflow, hiring-signal strategy, and follow-up automation.',
  );

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Practical recruiter resources for teams selling into hiring companies."
        description="This is the search layer behind Born: specific articles on outbound systems, hiring signals, follow-up, and prospect quality for recruiter teams that need better-fit companies in the queue."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Get the 5 prospects', to: '/contact' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-2">
          {insights.map((article) => (
            <article key={article.slug} className="surface-panel p-7">
              <p className="meta-kicker">{article.topic}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{article.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-700">{article.summary}</p>
              <ul className="mt-6 grid gap-3 text-sm leading-6 text-slate-700">
                {article.takeaways.slice(0, 3).map((item) => (
                  <li key={item} className="accent-card">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LinkArrow to={`/insights/${article.slug}`}>Read article</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Need the practical version applied to your market?"
        description="The articles explain the logic. The 5-prospect proof-of-concept shows how that logic would look across your target market."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Get the 5 prospects', to: '/contact' }}
      />
    </>
  );
}
