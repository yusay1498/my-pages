import { notFound } from 'next/navigation';
import { Fragment } from 'react';

import ArticleSection from '@/features/blog/components/ArticleSection';
import { getAllSlugs, getPostBySlug } from '@/features/blog/lib/posts';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllSlugs();

  return slugs.length > 0
    ? slugs.map((slug) => ({ slug }))
    : [{ slug: '__placeholder__' }];
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

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {post.meta.title}
        </h1>
        <p className="mt-3 text-gray-600">{post.meta.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.meta.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          更新日:{' '}
          <time dateTime={post.meta.updatedAt}>{post.meta.updatedAt}</time>
        </p>
      </header>

      <div className="space-y-8">
        {post.articles.map((article, index) => (
          <Fragment key={article.filename}>
            <ArticleSection article={article} />
            {index < post.articles.length - 1 ? (
              <hr className="border-gray-200" />
            ) : null}
          </Fragment>
        ))}
      </div>
    </main>
  );
}
