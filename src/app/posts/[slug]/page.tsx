import { notFound } from 'next/navigation';
import { Fragment } from 'react';

import ArticleSection from '@/features/blog/components/ArticleSection';
import { getAllSlugs, getPostBySlug } from '@/features/blog/lib/posts';

export const dynamicParams = false;
const PLACEHOLDER_SLUG = '__placeholder__';

export async function generateStaticParams() {
  const slugs = getAllSlugs();

  return slugs.length > 0
    ? slugs.map((slug) => ({ slug }))
    : [{ slug: PLACEHOLDER_SLUG }];
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.meta.status !== 'published') {
    notFound();
  }

  const updatedAtDisplay = post.meta.updatedAt.replaceAll('-', '/');
  const updatedAtDateTime = `${post.meta.updatedAt}T00:00:00Z`;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {post.meta.title}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {post.meta.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.meta.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          更新日: <time dateTime={updatedAtDateTime}>{updatedAtDisplay}</time>
        </p>
      </header>

      <div className="space-y-8">
        {post.articles.map((article, index) => (
          <Fragment key={article.filename}>
            <ArticleSection article={article} />
            {index < post.articles.length - 1 ? (
              <hr className="border-gray-200 dark:border-gray-700" />
            ) : null}
          </Fragment>
        ))}
      </div>
    </main>
  );
}
