import type { Article, TocItem } from '@/features/blog/types';

const HEADING_PATTERN = /^(#{2,3})\s+(.+)$/gm;

/**
 * HTMLタグを除去してプレーンテキストを取得する
 */
const stripHtmlTags = (text: string): string => {
  return text.replace(/<[^>]*>/g, '');
};

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

  return `article-${articleNumber}-${slug || 'untitled'}`;
};

/**
 * 同一記事内の重複IDを解決するためのスラッグカウンターを生成する
 * extractTocItems と ArticleSection の renderer で同一インスタンスを使用し整合性を保つ
 */
export const createSlugCounter = (): ((
  text: string,
  articleNumber: number,
) => string) => {
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
 * 重複解決なしの単発利用向け。ToC/renderer間で整合が必要な場合は createSlugCounter を使用する
 */
export const generateHeadingId = (
  text: string,
  articleNumber: number,
): string => {
  return generateBaseSlug(text, articleNumber);
};

/**
 * 記事のMarkdownコンテンツから見出し（h2, h3）を抽出してToCアイテムを生成する
 * 返却値の slugCounter を ArticleSection の renderer に渡すことで ID の整合性を保つ
 */
export const extractTocItems = (
  articles: Article[],
): { items: TocItem[]; slugCounter: (text: string, articleNumber: number) => string } => {
  const tocSlugCounter = createSlugCounter();
  const renderSlugCounter = createSlugCounter();

  const items = articles.flatMap((article) => {
    const articleItems: TocItem[] = [];
    let match: RegExpExecArray | null;

    HEADING_PATTERN.lastIndex = 0;

    while ((match = HEADING_PATTERN.exec(article.content)) !== null) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      articleItems.push({
        id: tocSlugCounter(text, article.number),
        text,
        level,
      });
    }

    return articleItems;
  });

  return { items, slugCounter: renderSlugCounter };
};
