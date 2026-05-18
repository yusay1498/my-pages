/** サイト全体で共有する設定値 */
const removeTrailingSlash = (value: string): string =>
  value.replace(/\/+$/g, '');

export const SITE_TITLE = "Yusay's TIL";
export const SITE_DESCRIPTION = '個人の学習アウトプットブログ';
export const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'yusay1498';
export const REPOSITORY_NAME =
  process.env.NEXT_PUBLIC_REPOSITORY_NAME ?? 'my-pages';

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
export const BASE_PATH =
  rawBasePath && rawBasePath !== '/'
    ? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
    : '';

const envSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_URL;
const defaultSitePath = BASE_PATH || `/${REPOSITORY_NAME}`;
const defaultSiteUrl = `https://${GITHUB_USERNAME}.github.io${defaultSitePath}`;

// SITE_URL の優先順位:
// 1) NEXT_PUBLIC_SITE_URL（明示的な公開URL）
// 2) NEXT_PUBLIC_URL（互換用のフォールバックURL）
// 3) GitHub Pages向け既定URL
export const SITE_URL = removeTrailingSlash(envSiteUrl ?? defaultSiteUrl);
