import { useEffect } from 'react';

const SITE_URL = 'https://born.directory';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

type SchemaValue = Record<string, unknown> | readonly Record<string, unknown>[];

interface PageMetaConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: SchemaValue;
  noIndex?: boolean;
}

function ensureMetaTag(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function ensureLinkTag(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function removeIfExists(selector: string) {
  document.head.querySelector(selector)?.remove();
}

function toAbsoluteUrl(value: string) {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

export default function usePageMeta(title: string, description: string): void;
export default function usePageMeta(config: PageMetaConfig): void;
export default function usePageMeta(titleOrConfig: string | PageMetaConfig, descriptionArg?: string) {
  const title = typeof titleOrConfig === 'string' ? titleOrConfig : titleOrConfig.title;
  const description = typeof titleOrConfig === 'string' ? descriptionArg ?? '' : titleOrConfig.description;
  const path = typeof titleOrConfig === 'string' ? '/' : titleOrConfig.path ?? '/';
  const image = typeof titleOrConfig === 'string' ? DEFAULT_IMAGE : titleOrConfig.image ?? DEFAULT_IMAGE;
  const type = typeof titleOrConfig === 'string' ? 'website' : titleOrConfig.type ?? 'website';
  const noIndex = typeof titleOrConfig === 'string' ? false : titleOrConfig.noIndex ?? false;
  const schema = typeof titleOrConfig === 'string' ? undefined : titleOrConfig.schema;
  const schemaJson = schema ? JSON.stringify(schema) : '';

  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(path);
    const imageUrl = toAbsoluteUrl(image);

    document.title = title;

    ensureMetaTag('meta[name="description"]', { name: 'description', content: description });
    ensureLinkTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    ensureMetaTag('meta[property="og:title"]', { property: 'og:title', content: title });
    ensureMetaTag('meta[property="og:description"]', { property: 'og:description', content: description });
    ensureMetaTag('meta[property="og:type"]', { property: 'og:type', content: type });
    ensureMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMetaTag('meta[property="og:image"]', { property: 'og:image', content: imageUrl });

    ensureMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    ensureMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    ensureMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });

    if (noIndex) {
      ensureMetaTag('meta[name="robots"]', { name: 'robots', content: 'noindex, nofollow' });
    } else {
      removeIfExists('meta[name="robots"]');
    }

    const schemaScriptId = 'page-json-ld';
    const existingScript = document.getElementById(schemaScriptId);

    if (schemaJson) {
      const script = existingScript ?? document.createElement('script');
      script.id = schemaScriptId;
      script.setAttribute('type', 'application/ld+json');
      script.textContent = schemaJson;

      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else {
      existingScript?.remove();
    }
  }, [description, image, noIndex, path, schemaJson, title, type]);
}
