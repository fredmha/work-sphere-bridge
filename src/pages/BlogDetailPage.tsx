import { useParams } from 'react-router-dom';

import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { blogPosts } from '@/content/blogContent';
import { primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogPosts.find((entry) => entry.slug === slug);

  usePageMeta(
    post
      ? {
          title: `${post.title} | Born`,
          description: post.seoDescription,
          path: `/blogs/${post.slug}`,
          type: 'article',
          schema: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.seoDescription,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            articleSection: post.category,
            author: {
              '@type': 'Organization',
              name: 'Born',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Born',
              logo: {
                '@type': 'ImageObject',
                url: 'https://born.directory/og-image.svg',
              },
            },
            mainEntityOfPage: `https://born.directory/blogs/${post.slug}`,
          },
        }
      : { title: 'Blog post | Born', description: 'Explore Born blog posts.', path: '/blogs' },
  );

  if (!post) return <NotFound />;

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.summary}
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Back to Blogs', to: '/blogs' }}
        aside={
          <div className="surface-panel p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Published</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{formatDate(post.publishedAt)}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Read time</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{post.readTime}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Why this page exists</p>
            <p className="mt-3 text-base leading-7 text-slate-700">
              To support clean SEO with a page that still feeds directly into the 5-prospect lead magnet.
            </p>
          </div>
        }
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,0.34fr)]">
          <article className="outline-panel p-7">
            <div className="article-prose">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
          </article>

          <aside className="grid gap-5">
            <div className="surface-panel p-7">
              <p className="meta-kicker">Internal links</p>
              <div className="mt-5 grid gap-4">
                <div className="info-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Primary CTA</p>
                  <div className="mt-3">
                    <LinkArrow to="/contact">Get the 5 researched prospects</LinkArrow>
                  </div>
                </div>
                <div className="info-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Related page</p>
                  <div className="mt-3">
                    <LinkArrow to="/process">See how the outbound build works</LinkArrow>
                  </div>
                </div>
                <div className="info-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">More reading</p>
                  <div className="mt-3">
                    <LinkArrow to="/insights">Read recruiter workflow insights</LinkArrow>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        title="Want this blog traffic pointed at something concrete?"
        description="The cleaner pattern is simple: article, internal links, lead magnet, then the booked call if the prospect quality is there."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Browse all blogs', to: '/blogs' }}
      />
    </>
  );
}
