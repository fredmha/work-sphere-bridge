import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { blogPosts } from '@/content/blogContent';
import { primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default function BlogsPage() {
  usePageMeta({
    title: 'Blogs | Born',
    description:
      'Read Born blog posts on recruiter outbound, lead magnets, prospecting workflow, and SEO-driven content for recruitment business development.',
    path: '/blogs',
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Born Blog',
      url: 'https://born.directory/blogs',
      description:
        'Born blog posts on recruiter outbound systems, researched prospects, and business-development workflow.',
      blogPost: blogPosts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `https://born.directory/blogs/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        description: post.seoDescription,
      })),
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Blogs"
        title="SEO pages that can actually carry commercial intent."
        description="This is the clean blog layer: targeted articles built to rank, link internally, and support the recruiter lead-magnet offer without turning into generic content sludge."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Read Insights', to: '/insights' }}
        highlights={['Built for clean SEO', 'Commercial intent first', 'Internal links that make sense']}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="surface-panel p-7">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>{post.category}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{formatDate(post.publishedAt)}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{post.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-700">{post.summary}</p>
              <div className="mt-6">
                <LinkArrow to={`/blogs/${post.slug}`}>Read the demo blog post</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Want the SEO layer tied directly to the offer?"
        description="The blog should support the lead magnet, not drift away from it. Pull the prospects first, then book the call if the quality is there."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See the contact flow', to: '/contact' }}
      />
    </>
  );
}
