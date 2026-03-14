import { Fragment, ReactNode } from 'react';

const imagePattern = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/;
const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function renderInlineContent(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(linkPattern)) {
    const [fullMatch, label, href] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <a
        key={`${href}-${index}`}
        href={href}
        {...(isExternalUrl(href) ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {label}
      </a>,
    );

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function BlogRichText({ body }: { body: string }) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => {
        const imageMatch = block.match(imagePattern);

        if (imageMatch) {
          const [, alt, src, title] = imageMatch;

          return (
            <figure key={`${src}-${index}`} className="blog-figure">
              <img src={src} alt={alt} className="blog-image" loading="lazy" />
              {(title || alt) && <figcaption>{title || alt}</figcaption>}
            </figure>
          );
        }

        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);

        if (lines.length > 0 && lines.every((line) => line.startsWith('- '))) {
          return (
            <ul key={`list-${index}`}>
              {lines.map((line, lineIndex) => (
                <li key={`item-${index}-${lineIndex}`}>{renderInlineContent(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={`paragraph-${index}`}>{renderInlineContent(block)}</p>;
      })}
    </>
  );
}
