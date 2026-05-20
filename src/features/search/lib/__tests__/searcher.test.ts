import { describe, expect, it } from 'vitest';

import { createSearcher } from '@/features/search/lib/searcher';
import type { SearchIndexEntry } from '@/features/search/types';

const createEntry = (
  slug: string,
  overrides: Partial<SearchIndexEntry> = {},
): SearchIndexEntry => ({
  slug,
  title: `${slug} title`,
  description: `${slug} description`,
  tags: [],
  content: `${slug} content`,
  ...overrides,
});

describe('createSearcher', () => {
  it('空文字や空白のみのクエリでは空配列を返す', () => {
    const searcher = createSearcher([createEntry('post-1')]);

    expect(searcher.search('')).toEqual([]);
    expect(searcher.search('   ')).toEqual([]);
  });

  it('一致件数は最大10件に制限する', () => {
    const searcher = createSearcher(
      Array.from({ length: 12 }, (_, index) =>
        createEntry(`post-${index + 1}`, {
          title: `React article ${index + 1}`,
        }),
      ),
    );

    const results = searcher.search('React');

    expect(results).toHaveLength(10);
    expect(results[0]?.slug).toBe('post-1');
    expect(results[9]?.slug).toBe('post-10');
  });

  it('タイトル一致を説明文一致より優先して返す', () => {
    const searcher = createSearcher([
      createEntry('title-match', {
        title: 'React search guide',
        description: 'TypeScript tips',
      }),
      createEntry('description-match', {
        title: 'Frontend guide',
        description: 'React search guide',
      }),
    ]);

    const results = searcher.search('React');

    expect(results.map((result) => result.slug)).toEqual([
      'title-match',
      'description-match',
    ]);
  });
});
