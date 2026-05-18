import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ProjectCard from '@/features/projects/components/ProjectCard';
import type { ProjectCard as ProjectCardType } from '@/features/projects/types';

const createProject = (
  overrides: Partial<ProjectCardType> = {},
): ProjectCardType => ({
  id: 1,
  name: 'my-pages',
  description: '個人サイト',
  language: 'TypeScript',
  stars: 10,
  forks: 2,
  topics: ['nextjs', 'typescript'],
  url: 'https://github.com/yusay1498/my-pages',
  homepage: 'https://example.com',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('ProjectCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('プロジェクト情報を描画する', () => {
    render(<ProjectCard project={createProject()} />);

    expect(screen.getByRole('heading', { name: 'my-pages' })).toBeTruthy();
    expect(screen.getByText('個人サイト')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /サイトを見る/ }).getAttribute('href'),
    ).toBe('https://example.com');
  });

  it('description が null の場合は説明文を表示しない', () => {
    render(<ProjectCard project={createProject({ description: null })} />);

    expect(screen.queryByText('個人サイト')).toBeNull();
    expect(screen.getByRole('heading', { name: 'my-pages' })).toBeTruthy();
  });

  it('topics が空の場合はトピックリストを表示しない', () => {
    render(<ProjectCard project={createProject({ topics: [] })} />);

    expect(screen.queryByRole('list', { name: 'トピック' })).toBeNull();
  });

  it('stars が 0 の場合はスター数を表示しない', () => {
    render(<ProjectCard project={createProject({ stars: 0 })} />);

    expect(screen.queryByText('スター数:')).toBeNull();
  });

  it('forks が 0 の場合はフォーク数を表示しない', () => {
    render(<ProjectCard project={createProject({ forks: 0 })} />);

    expect(screen.queryByText('フォーク数:')).toBeNull();
  });

  it('homepage が null の場合はサイトリンクを表示しない', () => {
    render(<ProjectCard project={createProject({ homepage: null })} />);

    expect(screen.queryByRole('link', { name: /サイトを見る/ })).toBeNull();
  });

  it('homepage が javascript: プロトコルの場合はサイトリンクを表示しない', () => {
    render(
      <ProjectCard
        project={createProject({ homepage: 'javascript:alert(1)' })}
      />,
    );

    expect(screen.queryByRole('link', { name: /サイトを見る/ })).toBeNull();
  });

  it('更新日をフォーマットして表示する', () => {
    render(
      <ProjectCard
        project={createProject({ updatedAt: '2026-05-15T00:00:00.000Z' })}
      />,
    );

    const timeEl = screen.getByText(/2026/);
    expect(timeEl).toBeTruthy();
  });

  it('language が null の場合は言語バッジを表示しない', () => {
    render(<ProjectCard project={createProject({ language: null })} />);

    expect(screen.queryByText('TypeScript')).toBeNull();
  });
});
