import { BlogSection, parseMarkdownToSections } from '@/lib/blogMarkdown';

export interface BlogPostItem {
  slug: string;
  title: string;
  summary: string;
  seoDescription: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  sections: readonly BlogSection[];
  bodyMarkdown: string;
}

const blogMarkdownFiles = import.meta.glob('./blog/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function parseFrontmatterValue(rawValue: string) {
  const value = rawValue.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseMarkdownDocument(markdown: string) {
  if (!markdown.startsWith('---\n')) {
    return {
      frontmatter: {},
      bodyMarkdown: markdown.trim(),
    };
  }

  const closingMarker = markdown.indexOf('\n---\n', 4);

  if (closingMarker === -1) {
    return {
      frontmatter: {},
      bodyMarkdown: markdown.trim(),
    };
  }

  const rawFrontmatter = markdown.slice(4, closingMarker).trim();
  const bodyMarkdown = markdown.slice(closingMarker + 5).trim();
  const frontmatter = rawFrontmatter.split('\n').reduce<Record<string, string>>((accumulator, line) => {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      return accumulator;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);

    if (!key) {
      return accumulator;
    }

    accumulator[key] = parseFrontmatterValue(value);
    return accumulator;
  }, {});

  return {
    frontmatter,
    bodyMarkdown,
  };
}

export function parseBlogPostMarkdown(filePath: string, markdown: string): BlogPostItem {
  const { frontmatter, bodyMarkdown } = parseMarkdownDocument(markdown);
  const slug = frontmatter.slug ?? filePath.split('/').pop()?.replace(/\.md$/, '') ?? 'untitled-post';

  return {
    slug,
    title: frontmatter.title ?? slug,
    summary: frontmatter.summary ?? '',
    seoDescription: frontmatter.seoDescription ?? frontmatter.summary ?? '',
    category: frontmatter.category ?? 'Uncategorised',
    publishedAt: frontmatter.publishedAt ?? new Date().toISOString().slice(0, 10),
    updatedAt: frontmatter.updatedAt ?? frontmatter.publishedAt ?? new Date().toISOString().slice(0, 10),
    readTime: frontmatter.readTime ?? '5 min read',
    bodyMarkdown,
    sections: parseMarkdownToSections(bodyMarkdown),
  };
}

export const blogPosts = Object.entries(blogMarkdownFiles)
  .map(([filePath, markdown]) => parseBlogPostMarkdown(filePath, markdown))
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
