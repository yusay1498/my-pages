import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ArticleSection from '@/features/blog/components/ArticleSection';

vi.mock('@/features/blog/components/MermaidBlockLazy', () => ({
  default: ({ code }: { code: string }) => (
    <div data-testid="mermaid-block">{code}</div>
  ),
}));

describe('ArticleSection', () => {
  afterEach(() => {
    cleanup();
  });

  const content = `## 見出し2

段落1です。

- 項目1
- 項目2

\`\`\`ts
const value = 1;
\`\`\`

\`\`\`mermaid
graph TD
A-->B
\`\`\`

### 見出し3

段落2です。`;

  const renderSection = () =>
    render(
      <ArticleSection
        article={{
          filename: 'article-1.md',
          number: 1,
          content,
        }}
        headingIdMap={
          new Map<string, string>([
            ['1:0', 'article-1-h2'],
            ['1:1', 'article-1-h3'],
          ])
        }
      />,
    );

  it('h2/h3 見出しに headingIdMap のIDを付与する', () => {
    renderSection();

    expect(screen.getByRole('heading', { level: 2, name: '見出し2' }).id).toBe(
      'article-1-h2',
    );
    expect(screen.getByRole('heading', { level: 3, name: '見出し3' }).id).toBe(
      'article-1-h3',
    );
  });

  it('空行・リスト・コード・Mermaid を含むMarkdownを描画する', () => {
    renderSection();

    expect(screen.getAllByText('項目1')).toHaveLength(1);
    expect(screen.getAllByText('項目2')).toHaveLength(1);
    expect(screen.getAllByText('const value = 1;')).toHaveLength(1);
    expect(screen.getByTestId('mermaid-block').textContent).toContain(
      'graph TD',
    );
    expect(screen.getAllByText('段落2です。')).toHaveLength(1);
  });
});
