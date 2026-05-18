export type SearchIndexEntry = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly content: string;
};
