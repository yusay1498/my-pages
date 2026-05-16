export type PostMetaStatus = 'draft' | 'published';

export type PostMeta = {
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: PostMetaStatus;
};

export type Article = {
  filename: string;
  number: number;
  content: string;
};

export type Post = {
  slug: string;
  meta: PostMeta;
  articles: Article[];
};

export type PostSummary = {
  slug: string;
  meta: PostMeta;
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};
