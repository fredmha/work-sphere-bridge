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

function isIndentedLine(line: string) {
  return /^[ \t]+/.test(line);
}

function foldMultilineValue(lines: string[], preserveLineBreaks: boolean) {
  const normalisedLines = lines.map((line) => line.replace(/^[ \t]+/, '').trimRight());

  if (preserveLineBreaks) {
    return normalisedLines.join('\n').trim();
  }

  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];

  for (const line of normalisedLines) {
    if (!line.trim()) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [];
      }

      continue;
    }

    currentParagraph.push(line.trim());
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }

  return paragraphs.join('\n\n').trim();
}

function parseFrontmatter(rawFrontmatter: string) {
  const lines = rawFrontmatter.split('\n');
  const frontmatter: Record<string, string> = {};
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      index += 1;
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1);

    if (!key) {
      index += 1;
      continue;
    }

    const trimmedValue = rawValue.trim();

    if (/^[>|][+-]?\d*$/.test(trimmedValue)) {
      const preserveLineBreaks = trimmedValue.startsWith('|');
      const blockLines: string[] = [];
      index += 1;

      while (index < lines.length && (isIndentedLine(lines[index]) || !lines[index].trim())) {
        blockLines.push(lines[index]);
        index += 1;
      }

      frontmatter[key] = foldMultilineValue(blockLines, preserveLineBreaks);
      continue;
    }

    const continuationLines: string[] = [];
    index += 1;

    while (index < lines.length && isIndentedLine(lines[index])) {
      continuationLines.push(lines[index]);
      index += 1;
    }

    frontmatter[key] =
      continuationLines.length > 0
        ? foldMultilineValue([rawValue, ...continuationLines], false)
        : parseFrontmatterValue(rawValue);
  }

  return frontmatter;
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
  const frontmatter = parseFrontmatter(rawFrontmatter);

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
