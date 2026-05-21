/** サイト全体で共有する設定値 */
/**
 * 先頭・末尾のスラッシュを用途に応じて取り除きます。
 *
 * @param value 正規化対象の文字列
 * @param options leading/trailing どちらを削除するかの指定
 * @returns 正規化後の文字列
 */
const trimSlashes = (
  value: string,
  {
    leading = true,
    trailing = true,
  }: { leading?: boolean; trailing?: boolean } = {},
): string => {
  let normalizedValue = value;

  if (leading) {
    normalizedValue = normalizedValue.replace(/^\/+/g, '');
  }

  if (trailing) {
    normalizedValue = normalizedValue.replace(/\/+$/g, '');
  }

  return normalizedValue;
};

export const SITE_TITLE = "Yusay's TIL";
export const SITE_DESCRIPTION = '個人の学習アウトプットブログ';
export const OPEN_GRAPH_LOCALE = 'ja_JP';
export const OPEN_GRAPH_TYPE_WEBSITE = 'website';
export const PROJECTS_TITLE = `Projects - ${SITE_TITLE}`;
export const PROJECTS_DESCRIPTION = 'パブリックリポジトリの一覧';
export const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'yusay1498';
export const REPOSITORY_NAME =
  process.env.NEXT_PUBLIC_REPOSITORY_NAME ?? 'my-pages';

/** giscus コメント機能の設定 */
const rawGiscusRepo =
  process.env.NEXT_PUBLIC_GISCUS_REPO ??
  `${GITHUB_USERNAME}/${REPOSITORY_NAME}`;
if (rawGiscusRepo && !rawGiscusRepo.includes('/')) {
  throw new Error(
    `NEXT_PUBLIC_GISCUS_REPO must be in "owner/repo" format: ${rawGiscusRepo}`,
  );
}
export const GISCUS_REPO = rawGiscusRepo as `${string}/${string}`;
export const GISCUS_REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '';
export const GISCUS_CATEGORY =
  process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'Comments';
export const GISCUS_CATEGORY_ID =
  process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '';

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
export const BASE_PATH =
  rawBasePath && rawBasePath !== '/' ? `/${trimSlashes(rawBasePath)}` : '';

const envSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_URL;
const defaultSitePath = BASE_PATH || `/${REPOSITORY_NAME}`;
const defaultSiteUrl = `https://${GITHUB_USERNAME}.github.io${defaultSitePath}`;
const normalizedSiteUrl = trimSlashes(envSiteUrl ?? defaultSiteUrl, {
  leading: false,
});

if (!/^https?:\/\//.test(normalizedSiteUrl)) {
  throw new Error(`SITE_URL must be an absolute URL: ${normalizedSiteUrl}`);
}

// SITE_URL の優先順位:
// 1) NEXT_PUBLIC_SITE_URL（明示的な公開URL）
// 2) NEXT_PUBLIC_URL（互換用のフォールバックURL）
// 3) GitHub Pages向け既定URL
export const SITE_URL = normalizedSiteUrl;

/**
 * サイト配信URL（basePathを含む）を基準に絶対URLを組み立てます。
 *
 * @param path 先頭スラッシュ付きのパス（basePath の有無を問わない）
 * @returns 絶対URL
 */
export const toAbsoluteSiteUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (normalizedPath === '/') {
    return SITE_URL;
  }

  if (!BASE_PATH) {
    return `${SITE_URL}${normalizedPath}`;
  }

  // BASE_PATH を含む入力は重複を避けるために取り除く。
  // 例: SITE_URL=https://example.com/my-pages に対して
  // - /my-pages/projects => /projects に正規化
  // - /about => そのまま /about
  const pathWithoutBasePath =
    normalizedPath === BASE_PATH
      ? ''
      : normalizedPath.startsWith(`${BASE_PATH}/`)
        ? normalizedPath.slice(BASE_PATH.length)
        : normalizedPath;

  return `${SITE_URL}${pathWithoutBasePath}`;
};
