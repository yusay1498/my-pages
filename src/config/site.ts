/** サイト全体で共有する設定値 */
const trimSlashes = (value: string): string => value.replace(/^\/+|\/+$/g, '');
const trimTrailingSlash = (value: string): string => value.replace(/\/+$/g, '');

export const SITE_TITLE = "Yusay's TIL";
export const SITE_DESCRIPTION = '個人の学習アウトプットブログ';
export const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'yusay1498';
export const REPOSITORY_NAME =
  process.env.NEXT_PUBLIC_REPOSITORY_NAME ?? 'my-pages';

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
export const BASE_PATH =
  rawBasePath && rawBasePath !== '/' ? `/${trimSlashes(rawBasePath)}` : '';

const explicitSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_URL;
const defaultSitePath = BASE_PATH || `/${REPOSITORY_NAME}`;
const defaultSiteUrl = `https://${GITHUB_USERNAME}.github.io${defaultSitePath}`;

export const SITE_URL = trimTrailingSlash(explicitSiteUrl ?? defaultSiteUrl);
