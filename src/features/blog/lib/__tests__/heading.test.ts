import { describe, expect, it } from 'vitest';

import {
  createSlugCounter,
  extractTocItems,
  generateHeadingId,
} from '@/features/blog/lib/heading';

describe('generateHeadingId', () => {
  it('英語テキストをスラッグに変換する', () => {
    expect(generateHeadingId('Hello World', 1)).toBe('article-1-hello-world');
  });

  it('日本語テキストをスラッグに変換する', () => {
    expect(generateHeadingId('見出し', 1)).toBe('article-1-見出し');
  });

  it('空テキストはデフォルトスラッグを返す', () => {
    expect(generateHeadingId('', 1)).toBe('article-1-untitled');
  });

  it('HTMLタグを除去してスラッグを生成する', () => {
    expect(generateHeadingId('<b>太字</b>テスト', 1)).toBe(
      'article-1-太字テスト',
    );
  });

  it('記事番号がスラッグに含まれる', () => {
    expect(generateHeadingId('test', 3)).toBe('article-3-test');
  });

  it('前後の空白をトリムする', () => {
    expect(generateHeadingId('  test  ', 1)).toBe('article-1-test');
  });

  it('連続する空白をハイフンに変換する', () => {
    expect(generateHeadingId('hello   world', 1)).toBe('article-1-hello-world');
  });

  it('大文字を小文字に変換する', () => {
    expect(generateHeadingId('Hello WORLD', 1)).toBe('article-1-hello-world');
  });
});

describe('createSlugCounter', () => {
  it('初回は接尾辞なしのスラッグを返す', () => {
    const counter = createSlugCounter();
    expect(counter('test', 1)).toBe('article-1-test');
  });

  it('同じテキストの2回目以降は接尾辞を付与する', () => {
    const counter = createSlugCounter();
    expect(counter('test', 1)).toBe('article-1-test');
    expect(counter('test', 1)).toBe('article-1-test-2');
    expect(counter('test', 1)).toBe('article-1-test-3');
  });

  it('異なるテキストにはそれぞれ独立したカウントを持つ', () => {
    const counter = createSlugCounter();
    expect(counter('alpha', 1)).toBe('article-1-alpha');
    expect(counter('beta', 1)).toBe('article-1-beta');
    expect(counter('alpha', 1)).toBe('article-1-alpha-2');
  });
});

describe('extractTocItems', () => {
  it('h2 と h3 の見出しを抽出する', () => {
    const articles = [
      {
        filename: 'article-1.md',
        number: 1,
        content: '## 見出し2\n\nテキスト\n\n### 見出し3\n\nテキスト',
      },
    ];

    const { items } = extractTocItems(articles);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ text: '見出し2', level: 2 });
    expect(items[1]).toMatchObject({ text: '見出し3', level: 3 });
  });

  it('headingIdMap を正しく生成する', () => {
    const articles = [
      {
        filename: 'article-1.md',
        number: 1,
        content: '## 最初\n\n### 次',
      },
    ];

    const { headingIdMap } = extractTocItems(articles);

    expect(headingIdMap.get('1:0')).toBe('article-1-最初');
    expect(headingIdMap.get('1:1')).toBe('article-1-次');
  });

  it('複数記事から見出しを抽出する', () => {
    const articles = [
      { filename: 'article-1.md', number: 1, content: '## A' },
      { filename: 'article-2.md', number: 2, content: '## B\n\n### C' },
    ];

    const { items, headingIdMap } = extractTocItems(articles);

    expect(items).toHaveLength(3);
    expect(headingIdMap.get('1:0')).toBe('article-1-a');
    expect(headingIdMap.get('2:0')).toBe('article-2-b');
    expect(headingIdMap.get('2:1')).toBe('article-2-c');
  });

  it('見出しがない場合は空配列を返す', () => {
    const articles = [
      { filename: 'article-1.md', number: 1, content: 'テキストのみ' },
    ];

    const { items, headingIdMap } = extractTocItems(articles);

    expect(items).toHaveLength(0);
    expect(headingIdMap.size).toBe(0);
  });

  it('空の記事配列では空の結果を返す', () => {
    const { items, headingIdMap } = extractTocItems([]);

    expect(items).toHaveLength(0);
    expect(headingIdMap.size).toBe(0);
  });

  it('同一記事内の重複見出しに連番を付与する', () => {
    const articles = [
      {
        filename: 'article-1.md',
        number: 1,
        content: '## same\n\n## same\n\n## same',
      },
    ];

    const { items } = extractTocItems(articles);

    expect(items).toHaveLength(3);
    expect(items[0].id).toBe('article-1-same');
    expect(items[1].id).toBe('article-1-same-2');
    expect(items[2].id).toBe('article-1-same-3');
  });
});
