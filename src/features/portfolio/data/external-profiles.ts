import { GITHUB_USERNAME } from '@/config/site';
import type { SiteLink } from '@/features/portfolio/types';

/** 外部プロフィール・SNS リンク */
export const EXTERNAL_PROFILES: readonly SiteLink[] = [
  {
    label: 'GitHub',
    url: `https://github.com/${GITHUB_USERNAME}`,
    description: 'GitHub プロフィール',
  },
  {
    label: 'Qiita',
    url: `https://qiita.com/${GITHUB_USERNAME}`,
    description: 'Qiita プロフィール',
  },
];
