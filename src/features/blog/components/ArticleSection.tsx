import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

import MermaidBlockLazy from '@/features/blog/components/MermaidBlockLazy';
import { generateHeadingId } from '@/features/blog/lib/heading';
import type { Article } from '@/features/blog/types';

type ArticleSectionProps = {
  article: Article;
  headingIdMap: Map<string, string>;
};

type ContentSegment =
  | { type: 'markdown'; content: string; tokenIndex: number }
  | { type: 'mermaid'; code: string; tokenIndex: number };

const ALLOWED_URI_SCHEMES = ['http', 'https', 'mailto'];

/**
 * marked.lexer() でトークン分割し、mermaid コードブロックと
 * 通常 Markdown のセグメントに分ける。
 * lexer ベースのため CommonMark の各種フェンス形式に対応している。
 */
function splitContentSegments(content: string): ContentSegment[] {
  const tokens = marked.lexer(content);
  const segments: ContentSegment[] = [];
  let markdownBuffer = '';
  let markdownStartIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'code' && token.lang === 'mermaid') {
      if (markdownBuffer) {
        segments.push({
          type: 'markdown',
          content: markdownBuffer,
          tokenIndex: markdownStartIndex,
        });
        markdownBuffer = '';
      }
      segments.push({ type: 'mermaid', code: token.text, tokenIndex: i });
      markdownStartIndex = i + 1;
    } else {
      if (!markdownBuffer) markdownStartIndex = i;
      markdownBuffer += token.raw;
    }
  }

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
  renderer.heading = (text: string, level: number) => {
    if (level === 2 || level === 3) {
      const id =
        headingIdMap.get(`${article.number}:${headingIndex}`) ??
        generateHeadingId(text, article.number);
      headingIndex++;
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
    return `<h${level}>${text}</h${level}>`;
  };

  const segments = splitContentSegments(article.content);

  const renderedSegments = segments.map((segment) => {
    const key = `${segment.type}-${segment.tokenIndex}`;

    if (segment.type === 'mermaid') {
      return <MermaidBlockLazy key={key} code={segment.code} />;
    }

    const rawHtml = marked.parse(segment.content, {
      async: false,
      renderer,
    }) as string;

    const html = DOMPurify.sanitize(rawHtml, {
      ALLOWED_URI_REGEXP: new RegExp(
        `^(${ALLOWED_URI_SCHEMES.join('|')}):`,
        'i',
      ),
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
