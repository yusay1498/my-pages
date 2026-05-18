import { describe, expect, it } from 'vitest';

import { createRssXml } from '@/features/blog/lib/rss';

describe('createRssXml', () => {
  it('記事リストからRSS XMLを生成する', () => {
    const xml = createRssXml([
      {
        slug: 'hello-world',
        meta: {
          title: 'Hello World',
          description: 'Description',
          tags: ['nextjs'],
          createdAt: '2025-01-01',
          updatedAt: '2025-01-02',
          status: 'published',
        },
      },
    ]);

    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain('<item>');
    expect(xml).toContain('<title>Hello World</title>');
    expect(xml).toContain(
      '<link>https://yusay1498.github.io/my-pages/posts/hello-world</link>',
    );
    expect(xml).toContain('<pubDate>Thu, 02 Jan 2025 00:00:00 GMT</pubDate>');
  });

  it('XML予約文字をエスケープする', () => {
    const xml = createRssXml([
      {
        slug: 'escape-test',
        meta: {
          title: 'A & B < C',
          description: 'Use "quote" and \'apostrophe\'',
          tags: [],
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          status: 'published',
        },
      },
    ]);

    expect(xml).toContain('<title>A &amp; B &lt; C</title>');
    expect(xml).toContain(
      '<description>Use &quot;quote&quot; and &apos;apostrophe&apos;</description>',
    );
  });

  it('無効な日付が含まれる場合はエラーを投げる', () => {
    expect(() =>
      createRssXml([
        {
          slug: 'invalid-date',
          meta: {
            title: 'Invalid',
            description: 'Invalid date',
            tags: [],
            createdAt: '2025-01-01',
            updatedAt: '2025-13-01',
            status: 'published',
          },
        },
      ]),
    ).toThrow('Invalid RSS date: 2025-13-01');
  });
});
