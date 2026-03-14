import { useParams } from 'react-router-dom';

import BlogArticlePage from '@/components/BlogArticlePage';
import usePageMeta from '@/hooks/usePageMeta';
import { findBlogDraftById } from '@/lib/blogDrafts';
import NotFound from '@/pages/NotFound';

export default function BlogPreviewPage() {
  const { draftId } = useParams();
  const draft = draftId ? findBlogDraftById(draftId) : null;

  usePageMeta(
    draft
      ? {
          title: `${draft.title} | Blog Preview | Born`,
          description: draft.seoDescription || draft.summary,
          path: `/blogs/preview/${draft.id}`,
          type: 'article',
          noIndex: true,
        }
      : { title: 'Blog preview | Born', description: 'Preview draft blog content.', path: '/blogs', noIndex: true },
  );

  if (!draft) return <NotFound />;

  return <BlogArticlePage post={draft} previewMode />;
}
