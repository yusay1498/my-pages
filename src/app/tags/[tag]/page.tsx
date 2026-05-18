import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { paths } from '@/config/paths';
import {
  OPEN_GRAPH_LOCALE,
  OPEN_GRAPH_TYPE_WEBSITE,
  SITE_TITLE,
  toAbsoluteSiteUrl,
} from '@/config/site';
import PostCard from '@/features/blog/components/PostCard';
import {
  getAllPublishedTags,
  getPostSummariesByTag,
} from '@/features/blog/lib/posts';

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = getAllPublishedTags();

  return tags.map((tag) => ({ tag }));
}

type PageParams = { params: Promise<{ tag: string }> };

const getTagPageData = cache((tag: string) => {
  const posts = getPostSummariesByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return { posts };
});

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { tag } = await params;
  void getTagPageData(tag);

  const title = `${tag} の記事一覧 - ${SITE_TITLE}`;
  const description = `タグ「${tag}」の記事一覧ページです。`;

  return {
    title,
    description,
    alternates: {
      canonical: toAbsoluteSiteUrl(paths.tag.getHref(tag)),
    },
    openGraph: {
      type: OPEN_GRAPH_TYPE_WEBSITE,
      locale: OPEN_GRAPH_LOCALE,
      title,
      description,
      siteName: SITE_TITLE,
      url: toAbsoluteSiteUrl(paths.tag.getHref(tag)),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

const TagPage = async ({ params }: PageParams) => {
  const { tag } = await params;
  const { posts } = getTagPageData(tag);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          タグ: {tag}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          「{tag}」の記事一覧です。
        </p>
      </header>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagPage;
