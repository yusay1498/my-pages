import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

import { paths } from '@/config/paths';
import {
  OPEN_GRAPH_LOCALE,
  SITE_TITLE,
  toAbsoluteSiteUrl,
} from '@/config/site';
import ArticleSection from '@/features/blog/components/ArticleSection';
import TableOfContents from '@/features/blog/components/TableOfContents';
import { PLACEHOLDER_SLUG } from '@/features/blog/lib/constants';
import { extractTocItems } from '@/features/blog/lib/heading';
import {
  getAllSlugs,
  getPostBySlug,
  getPostMetaBySlug,
} from '@/features/blog/lib/posts';
import { OGP_IMAGE_SIZE } from '@/features/seo/lib/og-image';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllSlugs();

  return slugs.length > 0
    ? slugs.map((slug) => ({ slug }))
    : [{ slug: PLACEHOLDER_SLUG }];
}

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostMetaBySlug(slug);

  if (!meta || meta.status !== 'published') {
    notFound();
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: toAbsoluteSiteUrl(paths.post.getHref(slug)),
    },
    openGraph: {
      type: 'article',
      locale: OPEN_GRAPH_LOCALE,
      title: meta.title,
      description: meta.description,
      url: toAbsoluteSiteUrl(paths.post.getHref(slug)),
      siteName: SITE_TITLE,
      images: [
        {
          url: toAbsoluteSiteUrl(paths.post.getOgpImageHref(slug)),
          width: OGP_IMAGE_SIZE.width,
          height: OGP_IMAGE_SIZE.height,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [toAbsoluteSiteUrl(paths.post.getOgpImageHref(slug))],
    },
  };
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.meta.status !== 'published') {
    notFound();
  }

  const updatedAtDisplay = post.meta.updatedAt.replaceAll('-', '/');
  const tocData = extractTocItems(post.articles);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
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
              <Link
                href={paths.tag.getHref(tag)}
                className="hover:underline"
                aria-label={`タグ「${tag}」の記事一覧を見る`}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          更新日: <time dateTime={post.meta.updatedAt}>{updatedAtDisplay}</time>
        </p>
      </header>

      <TableOfContents items={tocData.items} />

      <div className="space-y-8">
        {post.articles.map((article, index) => (
          <Fragment key={article.filename}>
            <ArticleSection
              article={article}
              headingIdMap={tocData.headingIdMap}
            />
            {index < post.articles.length - 1 ? (
              <hr className="border-gray-200 dark:border-gray-700" />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
