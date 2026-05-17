import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { paths } from '@/config/paths';

type SiteLink = {
  readonly label: string;
  readonly url: string;
  readonly description: string;
};

/** GitHub Pages で公開中のポートフォリオサイト */
const PORTFOLIO_SITES: readonly SiteLink[] = [
  {
    label: 'Othello by Next.js',
    url: 'https://yusay1498.github.io/othello-by-nextjs/',
    description: 'Next.js で作成したオセロゲーム',
  },
  {
    label: 'Survey System',
    url: 'https://yusay1498.github.io/survey-system/',
    description: 'アンケートシステムのフロントエンド',
  },
  {
    label: 'Queries Test',
    url: 'https://yusay1498.github.io/queries-test/',
    description: 'CSS クエリのテストページ',
  },
];

/** 外部プロフィール・SNS リンク */
const EXTERNAL_PROFILES: readonly SiteLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/yusay1498',
    description: 'GitHub プロフィール',
  },
];

const ExternalLinkCard = ({ link }: { readonly link: SiteLink }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
  >
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
        {link.label}
      </p>
      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
        {link.description}
      </p>
    </div>
    <ExternalLink
      className="size-4 shrink-0 text-gray-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
      aria-hidden="true"
    />
  </a>
);

const LinksSection = () => {
  return (
    <section aria-labelledby="links-heading" className="mt-16">
      <h2
        id="links-heading"
        className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
      >
        Links
      </h2>

      {/* ポートフォリオサイト */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Portfolio Sites
        </h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {PORTFOLIO_SITES.map((link) => (
            <ExternalLinkCard key={link.url} link={link} />
          ))}
        </div>
      </div>

      {/* 外部プロフィール・Projects ページ */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Profiles &amp; Projects
        </h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {EXTERNAL_PROFILES.map((link) => (
            <ExternalLinkCard key={link.url} link={link} />
          ))}
          <Link
            href={paths.projects.getHref()}
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                Projects
              </p>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                全リポジトリの一覧を見る
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LinksSection;
