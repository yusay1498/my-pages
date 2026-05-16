import { marked } from 'marked';

import type { Article } from '@/features/blog/types';

type ArticleSectionProps = {
  article: Article;
};

const ArticleSection = ({ article }: ArticleSectionProps) => {
  const html = marked.parse(article.content, { async: false }) as string;

  return (
    <section aria-label={`article-${article.number}`}>
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        {article.number}
      </h2>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
};

export default ArticleSection;
