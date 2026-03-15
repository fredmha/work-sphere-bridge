export interface BlogSection {
  heading: string;
  body: string;
}

export interface BlogHeading {
  id: string;
  level: number;
  text: string;
}

const markdownHeadingPattern = /^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/gm;

function stripInlineMarkdown(text: string) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .trim();
}

export function createMarkdownHeadingId(text: string, seenIds: Map<string, number>) {
  const baseId = stripInlineMarkdown(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    || 'section';

  const occurrenceCount = seenIds.get(baseId) ?? 0;
  seenIds.set(baseId, occurrenceCount + 1);

  return occurrenceCount === 0 ? baseId : `${baseId}-${occurrenceCount + 1}`;
}

export function extractMarkdownHeadings(markdown: string, minimumLevel = 2): BlogHeading[] {
  const normalisedMarkdown = markdown.replace(/\r\n?/g, '\n');
  const seenIds = new Map<string, number>();
  const headings: BlogHeading[] = [];

  for (const match of normalisedMarkdown.matchAll(markdownHeadingPattern)) {
    const hashes = match[1];
    const rawText = match[2]?.trim() ?? '';
    const level = hashes.length;

    if (!rawText || level < minimumLevel) {
      continue;
    }

    headings.push({
      id: createMarkdownHeadingId(rawText, seenIds),
      level,
      text: stripInlineMarkdown(rawText),
    });
  }

  return headings;
}

export function serialiseSectionsToMarkdown(sections: readonly BlogSection[]) {
  return sections
    .map((section) => `## ${section.heading}\n\n${section.body}`.trim())
    .join('\n\n');
}

export function parseMarkdownToSections(markdown: string): BlogSection[] {
  const trimmed = markdown.trim();

  if (!trimmed) {
    return [{ heading: 'Overview', body: '' }];
  }

  const matches = [...trimmed.matchAll(/^##\s+(.+)$/gm)];

  if (matches.length === 0) {
    return [{ heading: 'Overview', body: trimmed }];
  }

  return matches.map((match, index) => {
    const heading = match[1].trim();
    const start = match.index ?? 0;
    const bodyStart = start + match[0].length;
    const nextStart = index + 1 < matches.length ? matches[index + 1].index ?? trimmed.length : trimmed.length;
    const body = trimmed.slice(bodyStart, nextStart).trim();

    return {
      heading,
      body,
    };
  });
}
