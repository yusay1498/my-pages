import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

import MermaidBlock from '@/features/blog/components/MermaidBlock';
import { generateHeadingId } from '@/features/blog/lib/heading';
import type { Article } from '@/features/blog/types';

type ArticleSectionProps = {
  article: Article;
  headingIdMap: Map<string, string>;
};

type ContentSegment =
  | { type: 'markdown'; content: string; startIndex: number }
  | { type: 'mermaid'; code: string; startIndex: number };

const ALLOWED_URI_SCHEMES = ['http', 'https', 'mailto'];

// mermaidコードフェンスのパターン（gフラグ付きはlastIndexを持つため関数内でリセットが必要）
const MERMAID_FENCE_RE = /^```mermaid\s*\r?\n([\s\S]*?)\n\s*```$/gm;

/** Markdownコンテンツをmermaidブロックと通常Markdownのセグメントに分割する */
function splitContentSegments(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  MERMAID_FENCE_RE.lastIndex = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = MERMAID_FENCE_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'markdown',
        content: content.slice(lastIndex, match.index),
        startIndex: lastIndex,
      });
    }
    segments.push({ type: 'mermaid', code: match[1], startIndex: match.index });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'markdown',
      content: content.slice(lastIndex),
      startIndex: lastIndex,
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
    const key = `${segment.type}-${segment.startIndex}`;

    if (segment.type === 'mermaid') {
      return <MermaidBlock key={key} code={segment.code} />;
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
