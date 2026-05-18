import { paths } from '@/config/paths';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/config/site';
import type { PostSummary } from '@/features/blog/types';

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const formatDateForRssPubDate = (date: string): string => {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid RSS date: ${date}`);
  }

  return parsedDate.toUTCString();
};

export const createRssXml = (posts: readonly PostSummary[]): string => {
  const items = posts
    .map((post) => {
      const link = `${SITE_URL}${paths.post.getHref(post.slug)}`;
      const pubDate = formatDateForRssPubDate(post.meta.updatedAt);

      return [
        '    <item>',
        `      <title>${escapeXml(post.meta.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <description>${escapeXml(post.meta.description)}</description>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <guid>${escapeXml(link)}</guid>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(SITE_TITLE)}</title>`,
    `    <link>${escapeXml(SITE_URL)}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
};
