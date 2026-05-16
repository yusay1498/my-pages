import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

import { generateHeadingId } from '@/features/blog/lib/heading';
import type { Article } from '@/features/blog/types';

type ArticleSectionProps = {
  article: Article;
  headingIdMap: Map<string, string>;
};

const ALLOWED_URI_SCHEMES = ['http', 'https', 'mailto'];

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
  const rawHtml = marked.parse(article.content, {
    async: false,
    renderer,
  }) as string;

  const html = DOMPurify.sanitize(rawHtml, {
    ALLOWED_URI_REGEXP: new RegExp(`^(${ALLOWED_URI_SCHEMES.join('|')}):`, 'i'),
  });

  return (
    <article aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100"
      >
        第{article.number}節
      </h2>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
};

export default ArticleSection;
