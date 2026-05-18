import Fuse, { type IFuseOptions } from 'fuse.js';

import type { SearchIndexEntry } from '@/features/search/types';

export type SearchResult = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
};

const FUSE_OPTIONS: IFuseOptions<SearchIndexEntry> = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'description', weight: 2 },
    { name: 'tags', weight: 2 },
    { name: 'content', weight: 1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
};

const MAX_RESULTS = 10;

export const createSearcher = (index: SearchIndexEntry[]) => {
  const fuse = new Fuse(index, FUSE_OPTIONS);

  return {
    search: (query: string): SearchResult[] => {
      if (query.trim().length === 0) {
        return [];
      }

      return fuse.search(query, { limit: MAX_RESULTS }).map((result) => ({
        slug: result.item.slug,
        title: result.item.title,
        description: result.item.description,
        tags: result.item.tags,
      }));
    },
  };
};
