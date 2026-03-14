import { Link } from 'react-router-dom';

import { BlogPostItem } from '@/content/blogContent';
import BlogRichText from '@/components/BlogRichText';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

interface BlogArticlePageProps {
  post: BlogPostItem;
  previewMode?: boolean;
}

export default function BlogArticlePage({ post, previewMode = false }: BlogArticlePageProps) {
  return (
    <>
      {previewMode && (
        <section className="container-shell pt-6">
          <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
            Preview mode. This draft is loading from local storage and is not publicly linked.
          </div>
        </section>
      )}

      <section className="site-section relative overflow-hidden pt-12">
        <div className="hero-noise absolute inset-0 -z-20 opacity-70" />
        <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[82%] rounded-[2.9rem] opacity-30" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(18rem,0.7fr)] lg:items-start">
          <div className="section-frame relative z-10 p-8 sm:p-10 lg:p-12">
            <p className="eyebrow">{post.category}</p>
            <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,7vw,4.4rem)] font-semibold leading-[0.96] tracking-tight text-slate-950">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">{post.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{post.readTime}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Born blog</span>
            </div>
          </div>

          <aside className="grid gap-5">
            <div className="surface-panel p-7">
              <p className="meta-kicker">On this page</p>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
                {post.sections.map((section) => (
                  <li key={section.heading} className="list-card">
                    {section.heading}
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-panel p-7">
              <p className="meta-kicker">Continue</p>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
                <Link to="/blogs" className="accent-card block transition hover:border-primary/20">
                  Browse all blog posts
                </Link>
                <Link to="/insights" className="accent-card block transition hover:border-primary/20">
                  Read recruiter workflow insights
                </Link>
                <Link to="/contact" className="accent-card block transition hover:border-primary/20">
                  Get the 5 prospects
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="site-section">
        <div className="grid gap-6">
          <article className="outline-panel p-7 sm:p-8">
            <div className="article-prose">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <BlogRichText body={section.body} />
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
