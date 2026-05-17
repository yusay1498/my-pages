import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProjectCard from '@/features/projects/components/ProjectCard';

describe('ProjectCard', () => {
  it('プロジェクト情報を描画する', () => {
    render(
      <ProjectCard
        project={{
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
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'my-pages' })).toBeTruthy();
    expect(screen.getByText('個人サイト')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /サイトを見る/ }).getAttribute('href'),
    ).toBe('https://example.com');
  });
});
