import type { SiteLink } from '@/features/portfolio/types';

/** GitHub Pages で公開中のポートフォリオサイト */
export const PORTFOLIO_SITES: readonly SiteLink[] = [
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
    description: 'コンテナクエリ VS メディアクエリの学習用サイト',
  },
];
