import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import PostCard from '@/features/blog/components/PostCard';
import type { PostSummary } from '@/features/blog/types';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const createPost = (overrides: Partial<PostSummary> = {}): PostSummary => ({
  slug: 'test-post',
  meta: {
    title: 'テスト記事',
    description: 'テスト記事の説明文です',
    tags: ['TypeScript', 'React'],
    createdAt: '2026-01-15',
    updatedAt: '2026-03-20',
    status: 'published',
  },
  ...overrides,
});

describe('PostCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('記事タイトルを描画する', () => {
    render(<PostCard post={createPost()} />);

    expect(screen.getByRole('heading', { name: 'テスト記事' })).toBeTruthy();
  });

  it('記事説明文を描画する', () => {
    render(<PostCard post={createPost()} />);

    expect(screen.getByText('テスト記事の説明文です')).toBeTruthy();
  });

  it('タグを描画する', () => {
    render(<PostCard post={createPost()} />);

    expect(screen.getByText('TypeScript')).toBeTruthy();
    expect(screen.getByText('React')).toBeTruthy();
  });

  it('更新日をフォーマットして表示する', () => {
    render(<PostCard post={createPost()} />);

    expect(screen.getByText('2026/03/20')).toBeTruthy();
  });

  it('記事へのリンクが正しいhrefを持つ', () => {
    render(<PostCard post={createPost()} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/posts/test-post');
  });

  it('タグが空の場合はリスト内に項目がない', () => {
    const post = createPost({
      meta: {
        title: 'タグなし記事',
        description: '説明',
        tags: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
        status: 'published',
      },
    });

    render(<PostCard post={post} />);

    const tagList = screen.getByRole('list', { name: '記事のタグ' });
    expect(tagList.children).toHaveLength(0);
  });
});
