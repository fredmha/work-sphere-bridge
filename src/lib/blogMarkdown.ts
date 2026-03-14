export interface BlogSection {
  heading: string;
  body: string;
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
