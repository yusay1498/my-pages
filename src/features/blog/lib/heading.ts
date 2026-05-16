import type { Article, TocItem } from '@/features/blog/types';

const HEADING_PATTERN = /^(#{2,3})\s+(.+)$/gm;

/**
 * 見出しテキストからIDスラッグを生成する（日本語対応）
 * encodeURIComponentを使い、日本語文字はパーセントエンコーディングされる
 */
export const generateHeadingId = (text: string): string => {
  return encodeURIComponent(
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}\-]/gu, ''),
  );
};

/**
 * 記事のMarkdownコンテンツから見出し（h2, h3）を抽出してToCアイテムを生成する
 */
export const extractTocItems = (articles: Article[]): TocItem[] => {
  return articles.flatMap((article) => {
    const items: TocItem[] = [];
    let match: RegExpExecArray | null;

    // 正規表現のlastIndexをリセット
    HEADING_PATTERN.lastIndex = 0;

    while ((match = HEADING_PATTERN.exec(article.content)) !== null) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      items.push({
        id: generateHeadingId(text),
        text,
        level,
      });
    }

    return items;
  });
};
