import type { Metadata } from 'next';

import { paths } from '@/config/paths';
import {
  OPEN_GRAPH_LOCALE,
  OPEN_GRAPH_TYPE_WEBSITE,
  SITE_DESCRIPTION,
  SITE_TITLE,
  toAbsoluteSiteUrl,
} from '@/config/site';
import PostCard from '@/features/blog/components/PostCard';
import { getAllPostSummaries } from '@/features/blog/lib/posts';
import LinksSection from '@/features/portfolio/components/LinksSection';
import { OGP_IMAGE_SIZE } from '@/features/seo/lib/og-image';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: toAbsoluteSiteUrl(paths.home.getHref()),
  },
  openGraph: {
    type: OPEN_GRAPH_TYPE_WEBSITE,
    locale: OPEN_GRAPH_LOCALE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_TITLE,
    url: toAbsoluteSiteUrl(paths.home.getHref()),
    images: [
      {
        url: toAbsoluteSiteUrl(paths.home.getOgpImageHref()),
        width: OGP_IMAGE_SIZE.width,
        height: OGP_IMAGE_SIZE.height,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [toAbsoluteSiteUrl(paths.home.getOgpImageHref())],
  },
};

const HomePage = () => {
  const posts = getAllPostSummaries();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {SITE_TITLE}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {SITE_DESCRIPTION}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          記事がまだありません。
        </p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}

      <LinksSection />
    </div>
  );
};

export default HomePage;
