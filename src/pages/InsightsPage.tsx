import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { insights, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function InsightsPage() {
  usePageMeta(
    'Insights | Born',
    'Read practical Born resources on outbound systems for recruitment agencies, GoHighLevel for recruiters, hiring-signal workflows, and follow-up automation.',
  );

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Practical recruiter resources, written to rank and still be useful."
        description="This is the search layer behind Born: specific articles on outbound systems, hiring signals, GoHighLevel, and recruiter follow-up written for firms that actually run BD."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Book a Call', to: '/contact' }}
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
        title="Need the practical version applied to your recruiter team?"
        description="Insights help you get oriented. The audit helps you work out what should actually be built in your environment."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Contact Born', to: '/contact' }}
      />
    </>
  );
}
