import type { Article, TocItem } from '@/features/blog/types';

const HEADING_PATTERN = /^(#{2,3})\s+(.+)$/gm;
const DEFAULT_HEADING_SLUG = 'untitled';

/**
 * HTMLタグを除去してプレーンテキストを取得する
 */
const stripHtmlTags = (text: string): string => {
  return text.replace(/<[^>]*>/g, '');
};

type SlugGenerator = (text: string, articleNumber: number) => string;

/**
 * 見出しテキストからベースのIDスラッグを生成する（日本語対応）
 * articleNumber を付与して記事間の見出し重複を回避する
 */
const generateBaseSlug = (text: string, articleNumber: number): string => {
  const plainText = stripHtmlTags(text);
  const slug = plainText
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-]/gu, '');

  return `article-${articleNumber}-${slug || DEFAULT_HEADING_SLUG}`;
};

/**
 * 同一記事内の重複IDを解決するためのスラッグカウンターを生成する
 */
export const createSlugCounter = (): SlugGenerator => {
  const counts = new Map<string, number>();

  return (text: string, articleNumber: number): string => {
    const base = generateBaseSlug(text, articleNumber);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);

    return count === 0 ? base : `${base}-${count + 1}`;
  };
};

/**
 * 見出しテキストからIDスラッグを生成する（日本語対応）
 * 重複解決なしの単発利用向け
 */
export const generateHeadingId = (
  text: string,
  articleNumber: number,
): string => {
  return generateBaseSlug(text, articleNumber);
};

type ExtractTocResult = {
  items: TocItem[];
  headingIdMap: Map<string, string>;
};

/**
 * 記事のMarkdownコンテンツから見出し（h2, h3）を抽出してToCアイテムを生成する
 * headingIdMap は「articleNumber:見出し出現順」→ IDのマップで、renderer側のID参照に使用する
 */
export const extractTocItems = (articles: Article[]): ExtractTocResult => {
  const slugCounter = createSlugCounter();
  const headingIdMap = new Map<string, string>();
  const headingCounters = new Map<number, number>();

  const items = articles.flatMap((article) => {
    const articleItems: TocItem[] = [];
    let match: RegExpExecArray | null;

    HEADING_PATTERN.lastIndex = 0;

    while ((match = HEADING_PATTERN.exec(article.content)) !== null) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      const id = slugCounter(text, article.number);

      const idx = headingCounters.get(article.number) ?? 0;
      headingIdMap.set(`${article.number}:${idx}`, id);
      headingCounters.set(article.number, idx + 1);

      articleItems.push({ id, text, level });
    }

    return articleItems;
  });

  return { items, headingIdMap };
};
