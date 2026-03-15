import { ElementType, ReactNode } from 'react';

import { createMarkdownHeadingId } from '@/lib/blogMarkdown';

const blockImagePattern = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/;
const headingPattern = /^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/;
const fencedCodePattern = /^```([\w-]+)?\s*$/;
const unorderedListPattern = /^\s*[-*+]\s+(.+)$/;
const orderedListPattern = /^\s*\d+\.\s+(.+)$/;
const horizontalRulePattern = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function normaliseInlineText(text: string) {
  return text.replace(/\s*\n+\s*/g, ' ').trim();
}

function parseInlineMarkdown(text: string, keyPrefix = 'inline'): ReactNode[] {
  const nodes: ReactNode[] = [];
  let buffer = '';
  let index = 0;
  let tokenIndex = 0;

  const flushBuffer = () => {
    if (!buffer) return;
    nodes.push(buffer);
    buffer = '';
  };

  while (index < text.length) {
    if (text[index] === '\\' && index + 1 < text.length) {
      buffer += text[index + 1];
      index += 2;
      continue;
    }

    if (text[index] === '[') {
      const labelEnd = text.indexOf(']', index + 1);

      if (labelEnd !== -1 && text[labelEnd + 1] === '(') {
        const hrefEnd = text.indexOf(')', labelEnd + 2);

        if (hrefEnd !== -1) {
          const label = text.slice(index + 1, labelEnd);
          const href = text.slice(labelEnd + 2, hrefEnd).trim();

          flushBuffer();
          nodes.push(
            <a
              key={`${keyPrefix}-link-${tokenIndex}`}
              href={href}
              {...(isExternalUrl(href) ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {parseInlineMarkdown(label, `${keyPrefix}-label-${tokenIndex}`)}
            </a>,
          );
          tokenIndex += 1;
          index = hrefEnd + 1;
          continue;
        }
      }
    }

    if (text.startsWith('**', index) || text.startsWith('__', index)) {
      const delimiter = text.slice(index, index + 2);
      const closingIndex = text.indexOf(delimiter, index + 2);

      if (closingIndex !== -1) {
        const content = text.slice(index + 2, closingIndex);

        flushBuffer();
        nodes.push(
          <strong key={`${keyPrefix}-strong-${tokenIndex}`}>
            {parseInlineMarkdown(content, `${keyPrefix}-strong-inner-${tokenIndex}`)}
          </strong>,
        );
        tokenIndex += 1;
        index = closingIndex + 2;
        continue;
      }
    }

    if (text[index] === '*' || text[index] === '_') {
      const delimiter = text[index];
      const closingIndex = text.indexOf(delimiter, index + 1);

      if (closingIndex !== -1) {
        const content = text.slice(index + 1, closingIndex);

        flushBuffer();
        nodes.push(
          <em key={`${keyPrefix}-em-${tokenIndex}`}>
            {parseInlineMarkdown(content, `${keyPrefix}-em-inner-${tokenIndex}`)}
          </em>,
        );
        tokenIndex += 1;
        index = closingIndex + 1;
        continue;
      }
    }

    if (text[index] === '`') {
      const closingIndex = text.indexOf('`', index + 1);

      if (closingIndex !== -1) {
        flushBuffer();
        nodes.push(
          <code key={`${keyPrefix}-code-${tokenIndex}`}>
            {text.slice(index + 1, closingIndex)}
          </code>,
        );
        tokenIndex += 1;
        index = closingIndex + 1;
        continue;
      }
    }

    buffer += text[index];
    index += 1;
  }

  flushBuffer();
  return nodes;
}

function isBlockBoundary(line: string) {
  const trimmedLine = line.trim();

  if (!trimmedLine) {
    return true;
  }

  return (
    headingPattern.test(line) ||
    fencedCodePattern.test(trimmedLine) ||
    blockImagePattern.test(trimmedLine) ||
    horizontalRulePattern.test(trimmedLine) ||
    trimmedLine.startsWith('>') ||
    unorderedListPattern.test(line) ||
    orderedListPattern.test(line)
  );
}

function renderMarkdownBlocks(markdown: string, keyPrefix = 'block') {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const nodes: ReactNode[] = [];
  const seenHeadingIds = new Map<string, number>();
  let index = 0;
  let blockIndex = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    const fencedCodeMatch = trimmedLine.match(fencedCodePattern);

    if (fencedCodeMatch) {
      const language = fencedCodeMatch[1];
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().match(fencedCodePattern)) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      nodes.push(
        <pre key={`${keyPrefix}-pre-${blockIndex}`}>
          <code className={language ? `language-${language}` : undefined}>{codeLines.join('\n')}</code>
        </pre>,
      );
      blockIndex += 1;
      continue;
    }

    const imageMatch = trimmedLine.match(blockImagePattern);

    if (imageMatch) {
      const [, alt, src, title] = imageMatch;

      nodes.push(
        <figure key={`${keyPrefix}-image-${blockIndex}`} className="blog-figure">
          <img src={src} alt={alt} className="blog-image" loading="lazy" />
          {(title || alt) && <figcaption>{title || alt}</figcaption>}
        </figure>,
      );
      blockIndex += 1;
      index += 1;
      continue;
    }

    const headingMatch = line.match(headingPattern);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const HeadingTag = `h${Math.min(level, 6)}` as ElementType;
      const id = createMarkdownHeadingId(text, seenHeadingIds);

      nodes.push(
        <HeadingTag key={`${keyPrefix}-heading-${blockIndex}`} id={id}>
          {parseInlineMarkdown(text, `${keyPrefix}-heading-inline-${blockIndex}`)}
        </HeadingTag>,
      );
      blockIndex += 1;
      index += 1;
      continue;
    }

    if (horizontalRulePattern.test(trimmedLine)) {
      nodes.push(<hr key={`${keyPrefix}-hr-${blockIndex}`} />);
      blockIndex += 1;
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith('>')) {
      const quoteLines: string[] = [];

      while (index < lines.length) {
        const currentLine = lines[index].trim();

        if (!currentLine) {
          quoteLines.push('');
          index += 1;
          continue;
        }

        if (!currentLine.startsWith('>')) {
          break;
        }

        quoteLines.push(currentLine.replace(/^>\s?/, ''));
        index += 1;
      }

      nodes.push(
        <blockquote key={`${keyPrefix}-quote-${blockIndex}`}>
          {renderMarkdownBlocks(quoteLines.join('\n'), `${keyPrefix}-quote-inner-${blockIndex}`)}
        </blockquote>,
      );
      blockIndex += 1;
      continue;
    }

    const unorderedMatch = line.match(unorderedListPattern);
    const orderedMatch = line.match(orderedListPattern);

    if (unorderedMatch || orderedMatch) {
      const isOrdered = Boolean(orderedMatch);
      const listItems: string[] = [];
      const listMatcher = isOrdered ? orderedListPattern : unorderedListPattern;

      while (index < lines.length) {
        const currentLine = lines[index];
        const currentMatch = currentLine.match(listMatcher);

        if (!currentMatch) {
          break;
        }

        listItems.push(currentMatch[1].trim());
        index += 1;
      }

      const ListTag = isOrdered ? 'ol' : 'ul';

      nodes.push(
        <ListTag key={`${keyPrefix}-list-${blockIndex}`}>
          {listItems.map((item, itemIndex) => (
            <li key={`${keyPrefix}-item-${blockIndex}-${itemIndex}`}>
              {parseInlineMarkdown(item, `${keyPrefix}-item-inline-${blockIndex}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>,
      );
      blockIndex += 1;
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length && !isBlockBoundary(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length === 0) {
      paragraphLines.push(trimmedLine);
      index += 1;
    }

    nodes.push(
      <p key={`${keyPrefix}-paragraph-${blockIndex}`}>
        {parseInlineMarkdown(paragraphLines.join(' '), `${keyPrefix}-paragraph-inline-${blockIndex}`)}
      </p>,
    );
    blockIndex += 1;
  }

  return nodes;
}

export function BlogInlineMarkdown({ text }: { text: string }) {
  return <>{parseInlineMarkdown(normaliseInlineText(text))}</>;
}

export default function BlogRichText({ body }: { body: string }) {
  return <>{renderMarkdownBlocks(body)}</>;
}
