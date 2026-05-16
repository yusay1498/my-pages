export type PostMetaStatus = 'draft' | 'published';

export type PostMeta = {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly status: PostMetaStatus;
};

export type Article = {
  readonly filename: string;
  readonly number: number;
  readonly content: string;
};

export type Post = {
  readonly slug: string;
  readonly meta: PostMeta;
  readonly articles: readonly Article[];
};

export type PostSummary = {
  readonly slug: string;
  readonly meta: PostMeta;
};

export type TocItem = {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
};
