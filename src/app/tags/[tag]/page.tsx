import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { paths } from '@/config/paths';
import {
  OPEN_GRAPH_LOCALE,
  OPEN_GRAPH_TYPE_WEBSITE,
  SITE_TITLE,
  toAbsoluteSiteUrl,
} from '@/config/site';
import PostCard from '@/features/blog/components/PostCard';
import { PLACEHOLDER_TAG } from '@/features/blog/lib/constants';
import {
  getAllPublishedTags,
  getPostSummariesByTag,
} from '@/features/blog/lib/posts';

export const dynamicParams = false;

const decodeTagParam = (tag: string): string => {
  try {
    return decodeURIComponent(tag);
  } catch {
    return tag;
  }
};

export async function generateStaticParams() {
  const tags = getAllPublishedTags();

  return tags.length > 0
    ? tags.map((tag) => ({ tag }))
    : [{ tag: PLACEHOLDER_TAG }];
}

type PageParams = { params: Promise<{ tag: string }> };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeTagParam(tag);
  const posts = getPostSummariesByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  const title = `${decodedTag} の記事一覧 - ${SITE_TITLE}`;
  const description = `タグ「${decodedTag}」の記事一覧ページです。`;

  return {
    title,
    description,
    alternates: {
      canonical: toAbsoluteSiteUrl(paths.tag.getHref(decodedTag)),
    },
    openGraph: {
      type: OPEN_GRAPH_TYPE_WEBSITE,
      locale: OPEN_GRAPH_LOCALE,
      title,
      description,
      siteName: SITE_TITLE,
      url: toAbsoluteSiteUrl(paths.tag.getHref(decodedTag)),
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
  const decodedTag = decodeTagParam(tag);
  const posts = getPostSummariesByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          タグ: {decodedTag}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          「{decodedTag}」の記事一覧です。
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
