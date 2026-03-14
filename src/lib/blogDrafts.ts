import { BlogPostItem } from '@/content/blogContent';
import { parseMarkdownToSections, serialiseSectionsToMarkdown } from '@/lib/blogMarkdown';

export interface BlogDraft extends BlogPostItem {
  id: string;
  createdAt: string;
  bodyMarkdown: string;
}

const BLOG_DRAFT_STORAGE_KEY = 'bxgse-blog-drafts';

function makeDraftId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normaliseSections(sections: unknown): BlogPostItem['sections'] {
  if (!Array.isArray(sections) || sections.length === 0) {
    return [{ heading: 'New section', body: '' }];
  }

  return sections.map((section) => {
    const record = typeof section === 'object' && section ? (section as Record<string, unknown>) : {};

    return {
      heading: typeof record.heading === 'string' ? record.heading : 'Untitled section',
      body: typeof record.body === 'string' ? record.body : '',
    };
  });
}

export function createEmptyBlogDraft(): BlogDraft {
  const now = new Date().toISOString();
  const bodyMarkdown = '## Opening section\n\nWrite the article here.';

  return {
    id: makeDraftId(),
    slug: 'new-blog-post',
    title: 'Untitled blog post',
    summary: '',
    seoDescription: '',
    category: 'Draft',
    publishedAt: now.slice(0, 10),
    updatedAt: now.slice(0, 10),
    readTime: '5 min read',
    bodyMarkdown,
    sections: parseMarkdownToSections(bodyMarkdown),
    createdAt: now,
  };
}

export function createDraftFromPost(post: BlogPostItem): BlogDraft {
  const now = new Date().toISOString();

  return {
    ...post,
    id: makeDraftId(),
    slug: `${post.slug}-draft`,
    updatedAt: now.slice(0, 10),
    createdAt: now,
    bodyMarkdown: post.bodyMarkdown || serialiseSectionsToMarkdown(post.sections),
    sections: post.sections.map((section) => ({ ...section })),
  };
}

export function normaliseDraft(input: Partial<BlogDraft>): BlogDraft {
  const emptyDraft = createEmptyBlogDraft();

  return {
    ...emptyDraft,
    ...input,
    id: typeof input.id === 'string' && input.id ? input.id : emptyDraft.id,
    slug: typeof input.slug === 'string' && input.slug ? input.slug : emptyDraft.slug,
    title: typeof input.title === 'string' && input.title ? input.title : emptyDraft.title,
    summary: typeof input.summary === 'string' ? input.summary : emptyDraft.summary,
    seoDescription: typeof input.seoDescription === 'string' ? input.seoDescription : emptyDraft.seoDescription,
    category: typeof input.category === 'string' && input.category ? input.category : emptyDraft.category,
    publishedAt: typeof input.publishedAt === 'string' && input.publishedAt ? input.publishedAt : emptyDraft.publishedAt,
    updatedAt: typeof input.updatedAt === 'string' && input.updatedAt ? input.updatedAt : emptyDraft.updatedAt,
    readTime: typeof input.readTime === 'string' && input.readTime ? input.readTime : emptyDraft.readTime,
    createdAt: typeof input.createdAt === 'string' && input.createdAt ? input.createdAt : emptyDraft.createdAt,
    bodyMarkdown:
      typeof input.bodyMarkdown === 'string' && input.bodyMarkdown
        ? input.bodyMarkdown
        : serialiseSectionsToMarkdown(normaliseSections(input.sections)),
    sections:
      typeof input.bodyMarkdown === 'string' && input.bodyMarkdown
        ? parseMarkdownToSections(input.bodyMarkdown)
        : normaliseSections(input.sections),
  };
}

export function readBlogDrafts(): BlogDraft[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw) as Partial<BlogDraft>[];
    return Array.isArray(parsed) ? parsed.map(normaliseDraft) : [];
  } catch {
    return [];
  }
}

export function writeBlogDrafts(drafts: BlogDraft[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify(drafts));
}

export function findBlogDraftById(draftId: string): BlogDraft | null {
  return readBlogDrafts().find((draft) => draft.id === draftId) ?? null;
}
