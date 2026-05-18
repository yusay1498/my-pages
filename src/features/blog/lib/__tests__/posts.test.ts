import { describe, expect, it } from 'vitest';

import {
  getAllPublishedTagsFromSummaries,
  getPostSummariesByTagFromSummaries,
} from '@/features/blog/lib/posts';
import type { PostSummary } from '@/features/blog/types';

const postSummaries: PostSummary[] = [
  {
    slug: 'post-a',
    meta: {
      title: 'Post A',
      description: 'A',
      tags: ['React', 'TypeScript'],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
      status: 'published',
    },
  },
  {
    slug: 'post-b',
    meta: {
      title: 'Post B',
      description: 'B',
      tags: ['TypeScript', '初心者向け'],
      createdAt: '2026-01-03',
      updatedAt: '2026-01-04',
      status: 'published',
    },
  },
  {
    slug: 'post-c',
    meta: {
      title: 'Post C',
      description: 'C',
      tags: [],
      createdAt: '2026-01-05',
      updatedAt: '2026-01-06',
      status: 'published',
    },
  },
];

describe('getAllPublishedTagsFromSummaries', () => {
  it('重複を除いたタグ一覧をソートして返す', () => {
    expect(getAllPublishedTagsFromSummaries(postSummaries)).toEqual([
      'React',
      'TypeScript',
      '初心者向け',
    ]);
  });

  it('記事が空なら空配列を返す', () => {
    expect(getAllPublishedTagsFromSummaries([])).toEqual([]);
  });

  it('空文字や空白のみのタグを除外する', () => {
    const summariesWithEmptyTags: PostSummary[] = [
      {
        slug: 'post-d',
        meta: {
          title: 'Post D',
          description: 'D',
          tags: ['React', '', '  '],
          createdAt: '2026-01-07',
          updatedAt: '2026-01-08',
          status: 'published',
        },
      },
    ];
    expect(getAllPublishedTagsFromSummaries(summariesWithEmptyTags)).toEqual([
      'React',
    ]);
  });
});

describe('getPostSummariesByTagFromSummaries', () => {
  it('タグに一致する記事のみを返す', () => {
    const result = getPostSummariesByTagFromSummaries(
      postSummaries,
      'TypeScript',
    );

    expect(result.map((item) => item.slug)).toEqual(['post-a', 'post-b']);
  });

  it('一致しないタグでは空配列を返す', () => {
    expect(
      getPostSummariesByTagFromSummaries(postSummaries, 'NotFoundTag'),
    ).toEqual([]);
  });

  it('大文字小文字を区別して一致判定する', () => {
    expect(getPostSummariesByTagFromSummaries(postSummaries, 'react')).toEqual(
      [],
    );
  });
});
