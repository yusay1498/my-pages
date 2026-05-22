import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

import CodeBlock from '@/features/blog/components/CodeBlock';
import MermaidBlockLazy from '@/features/blog/components/MermaidBlockLazy';
import { generateHeadingId } from '@/features/blog/lib/heading';
import type { Article } from '@/features/blog/types';

type ArticleSectionProps = {
  readonly article: Article;
  readonly headingIdMap: ReadonlyMap<string, string>;
};

type ContentSegment =
  | {
      readonly type: 'markdown';
      readonly content: string;
      readonly tokenIndex: number;
    }
  | {
      readonly type: 'mermaid';
      readonly code: string;
      readonly tokenIndex: number;
    }
  | {
      readonly type: 'code';
      readonly code: string;
      readonly language?: string;
      readonly tokenIndex: number;
    };

const ALLOWED_URI_SCHEMES = ['http', 'https', 'mailto'] as const;

/** DOMPurify に渡す URI スキーム制限の正規表現（モジュールスコープで1度だけ生成） */
const ALLOWED_URI_REGEXP = new RegExp(
  `^(${ALLOWED_URI_SCHEMES.join('|')}):`,
  'i',
);

/**
 * marked.lexer() でトークン分割し、mermaid コードブロックと
 * 通常 Markdown のセグメントに分ける。
 * lexer ベースのため CommonMark の各種フェンス形式に対応している。
 */
function splitContentSegments(content: string): ContentSegment[] {
  const tokens = marked.lexer(content);
  const segments: ContentSegment[] = [];
  // mermaid ブロック以外の連続するトークンを一時的に溜めるバッファ
  let markdownBuffer = '';
  // 現バッファの先頭トークンのインデックス（Reactキー生成に使用）
  let markdownStartIndex = 0;

  for (const [i, token] of tokens.entries()) {
    if (token.type === 'code') {
      if (markdownBuffer) {
        segments.push({
          type: 'markdown',
          content: markdownBuffer,
          tokenIndex: markdownStartIndex,
        });
        markdownBuffer = '';
      }

      if (token.lang === 'mermaid') {
        segments.push({
          type: 'mermaid',
          code: token.text,
          tokenIndex: i,
        });
      } else {
        segments.push({
          type: 'code',
          code: token.text,
          language: token.lang,
          tokenIndex: i,
        });
      }

      markdownStartIndex = i + 1;
    } else {
      // 通常 Markdown トークン: raw テキストをバッファに蓄積
      if (!markdownBuffer) markdownStartIndex = i;
      markdownBuffer += token.raw;
    }
  }

  // 末尾に残ったバッファをセグメント化
  if (markdownBuffer) {
    segments.push({
      type: 'markdown',
      content: markdownBuffer,
      tokenIndex: markdownStartIndex,
    });
  }

  return segments;
}

const ArticleSection = ({ article, headingIdMap }: ArticleSectionProps) => {
  const headingId = `article-${article.number}-section`;
  let headingIndex = 0;
  const renderer = new marked.Renderer();
  renderer.html = () => '';
  renderer.heading = ({ tokens, depth }) => {
    const parser = renderer.parser ?? new marked.Parser();
    const text = parser.parseInline(tokens);
    if (depth === 2 || depth === 3) {
      const id =
        headingIdMap.get(`${article.number}:${headingIndex}`) ??
        generateHeadingId(text, article.number);
      headingIndex++;
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    }
    return `<h${depth}>${text}</h${depth}>`;
  };

  const segments = splitContentSegments(article.content);

  const renderedSegments = segments.map((segment) => {
    const key = `${segment.type}-${segment.tokenIndex}`;

    if (segment.type === 'mermaid') {
      return <MermaidBlockLazy key={key} code={segment.code} />;
    }

    if (segment.type === 'code') {
      return (
        <CodeBlock key={key} code={segment.code} language={segment.language} />
      );
    }

    const rawHtml = marked.parse(segment.content, {
      async: false,
      renderer,
    }) as string;

    const html = DOMPurify.sanitize(rawHtml, {
      ALLOWED_URI_REGEXP,
    });

    return <div key={key} dangerouslySetInnerHTML={{ __html: html }} />;
  });

  return (
    <article aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100"
      >
        第{article.number}節
      </h2>
      <div className="prose max-w-none prose-gray dark:prose-invert">
        {renderedSegments}
      </div>
    </article>
  );
};

export default ArticleSection;
