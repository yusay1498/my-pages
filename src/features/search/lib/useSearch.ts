'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { BASE_PATH } from '@/config/site';
import {
  createSearcher,
  type SearchResult,
} from '@/features/search/lib/searcher';
import type { SearchIndexEntry } from '@/features/search/types';

type SearchState = {
  readonly isLoading: boolean;
  readonly results: readonly SearchResult[];
  readonly error: string | null;
};

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    results: [],
    error: null,
  });
  const searcherRef = useRef<ReturnType<typeof createSearcher> | null>(null);
  const indexLoadedRef = useRef(false);

  const loadIndex = useCallback(async () => {
    if (indexLoadedRef.current) return;
    indexLoadedRef.current = true;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${BASE_PATH}/search-index.json`);
      if (!response.ok) {
        throw new Error('検索インデックスの読み込みに失敗しました');
      }

      const index: SearchIndexEntry[] = await response.json();
      searcherRef.current = createSearcher(index);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setState({ isLoading: false, results: [], error: message });
      indexLoadedRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!searcherRef.current || query.trim().length === 0) {
      setState((prev) => ({ ...prev, results: [] }));
      return;
    }

    const results = searcherRef.current.search(query);
    setState((prev) => ({ ...prev, results }));
  }, [query]);

  return {
    query,
    setQuery,
    ...state,
    loadIndex,
  };
};
