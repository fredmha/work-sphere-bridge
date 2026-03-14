import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = 'https://born.directory';
const now = new Date().toISOString();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function readMarkdownFiles(relativePath) {
  const targetDir = path.join(rootDir, relativePath);

  if (!fs.existsSync(targetDir)) {
    return [];
  }

  return fs
    .readdirSync(targetDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => readFile(path.join(relativePath, fileName)));
}

function extractSlugs(source, exportName) {
  const pattern = new RegExp(`export const ${exportName} = \\[(.*?)\\] as const`, 's');
  const match = source.match(pattern);

  if (!match) return [];

  return [...match[1].matchAll(/slug:\s*'([^']+)'/g)].map((entry) => entry[1]);
}

function extractMarkdownSlug(source) {
  const match = source.match(/^slug:\s*(.+)$/m);

  if (!match) return null;

  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function toUrlXml(route) {
  return [
    '  <url>',
    `    <loc>${siteUrl}${route}</loc>`,
    `    <lastmod>${now}</lastmod>`,
    '  </url>',
  ].join('\n');
}

function writeFileIfPossible(relativePath, content) {
  const targetPath = path.join(rootDir, relativePath);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, content);
}

const bornContent = readFile('src/content/bornSiteContent.ts');
const blogSlugs = readMarkdownFiles('src/content/blog')
  .map(extractMarkdownSlug)
  .filter(Boolean);

const routes = [
  '/',
  '/process',
  '/services',
  '/industries',
  '/blogs',
  '/case-studies',
  '/insights',
  '/about',
  '/contact',
  ...extractSlugs(bornContent, 'services').map((slug) => `/services/${slug}`),
  ...extractSlugs(bornContent, 'industries').map((slug) => `/industries/${slug}`),
  ...extractSlugs(bornContent, 'caseStudies').map((slug) => `/case-studies/${slug}`),
  ...extractSlugs(bornContent, 'insights').map((slug) => `/insights/${slug}`),
  ...blogSlugs.map((slug) => `/blogs/${slug}`),
];

const uniqueRoutes = [...new Set(routes)];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueRoutes.map(toUrlXml),
  '</urlset>',
  '',
].join('\n');

writeFileIfPossible('public/sitemap.xml', sitemap);
writeFileIfPossible('dist/sitemap.xml', sitemap);
