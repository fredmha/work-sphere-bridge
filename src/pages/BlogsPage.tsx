import { LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import usePageMeta from '@/hooks/usePageMeta';
import { useBlogPosts } from '@/lib/blogPublished';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default function BlogsPage() {
  const { posts } = useBlogPosts();
  const [featuredPost, ...morePosts] = posts;

  usePageMeta({
    title: 'Blogs | Born',
    description:
      'Read Born articles on recruiter outbound, prospect strategy, workflow design, and commercial positioning.',
    path: '/blogs',
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Born Blog',
      url: 'https://born.directory/blogs',
      description: 'Born articles on recruiter outbound systems, prospect strategy, workflow design, and positioning.',
      blogPost: posts.map((post) => ({
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
        title="Writing on recruiter outbound, prospect strategy, and commercial execution."
        description="Clear points of view on how recruiter teams target better accounts, run tighter workflows, and present a more credible offer in market."
        highlights={['Prospect strategy', 'Workflow design', 'Commercial positioning']}
        aside={
          <div className="surface-panel p-7">
            <p className="meta-kicker">What you&rsquo;ll find</p>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              <p>Sharper views on recruiter business development.</p>
              <p>Practical operating ideas your team can apply.</p>
              <p>Writing that supports the offer without sounding like filler.</p>
            </div>
          </div>
        }
      />

      <section className="site-section">
        {featuredPost && (
          <article className="surface-panel grid gap-6 p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.44fr)] lg:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>{featuredPost.category}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{formatDate(featuredPost.publishedAt)}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{featuredPost.title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{featuredPost.summary}</p>
              <div className="mt-6">
                <LinkArrow to={`/blogs/${featuredPost.slug}`}>Read article</LinkArrow>
              </div>
            </div>

            <div className="outline-panel p-6">
              <p className="meta-kicker">Key point</p>
              <p className="mt-4 text-base leading-7 text-slate-700">{featuredPost.seoDescription}</p>
            </div>
          </article>
        )}
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-6 lg:grid-cols-2">
          {morePosts.map((post) => (
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
                <LinkArrow to={`/blogs/${post.slug}`}>Read article</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
