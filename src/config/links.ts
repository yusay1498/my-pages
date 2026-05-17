export type SiteLink = {
  readonly label: string;
  readonly url: string;
  readonly description: string;
};

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

/** 外部プロフィール・SNS リンク */
export const EXTERNAL_PROFILES: readonly SiteLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/yusay1498',
    description: 'GitHub プロフィール',
  },
  {
    label: 'Qiita',
    url: 'https://qiita.com/yusay1498',
    description: 'Qiita プロフィール',
  },
];
