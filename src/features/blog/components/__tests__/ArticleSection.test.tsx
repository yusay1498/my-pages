import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ArticleSection from '@/features/blog/components/ArticleSection';

vi.mock('@/features/blog/components/MermaidBlockLazy', () => ({
  default: ({ code }: { code: string }) => (
    <div data-testid="mermaid-block">{code}</div>
  ),
}));

describe('ArticleSection', () => {
  it('空行・リスト・コード・Mermaid を含むMarkdownを描画し見出しIDを付与する', () => {
    render(
      <ArticleSection
        article={{
          filename: 'article-1.md',
          number: 1,
          content: `## 見出し2

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

段落2です。`,
        }}
        headingIdMap={
          new Map<string, string>([
            ['1:0', 'article-1-h2'],
            ['1:1', 'article-1-h3'],
          ])
        }
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: '見出し2' }).id).toBe(
      'article-1-h2',
    );
    expect(screen.getByRole('heading', { level: 3, name: '見出し3' }).id).toBe(
      'article-1-h3',
    );
    screen.getByText('項目1');
    screen.getByText('項目2');
    screen.getByText('const value = 1;');
    expect(screen.getByTestId('mermaid-block').textContent).toContain(
      'graph TD',
    );
    screen.getByText('段落2です。');
  });
});
