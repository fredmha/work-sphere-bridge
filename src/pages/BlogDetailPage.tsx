import { useParams } from 'react-router-dom';

import BlogArticlePage from '@/components/BlogArticlePage';
import usePageMeta from '@/hooks/usePageMeta';
import { useBlogPosts } from '@/lib/blogPublished';
import NotFound from '@/pages/NotFound';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { posts, isLoading } = useBlogPosts();
  const post = posts.find((entry) => entry.slug === slug);

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

  if (!post && isLoading) {
    return (
      <div className="container-shell flex min-h-[40vh] items-center justify-center py-16">
        <div className="rounded-full border border-border/80 bg-white/85 px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          Loading article...
        </div>
      </div>
    );
  }

  if (!post) return <NotFound />;

  return <BlogArticlePage post={post} />;
}
