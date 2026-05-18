'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';

import { paths } from '@/config/paths';
import { useSearch } from '@/features/search/lib/useSearch';

type SearchDialogProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const { query, setQuery, results, isLoading, error, loadIndex } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadIndex();
      dialogRef.current?.showModal();
      // 少し待ってからフォーカス（ダイアログのアニメーション対応）
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      dialogRef.current?.close();
      setQuery('');
    }
  }, [isOpen, loadIndex, setQuery]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 h-full w-full max-w-none bg-transparent p-0 backdrop:bg-black/50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      aria-label="記事を検索"
    >
      <div className="mx-auto mt-[10vh] w-full max-w-lg rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="記事を検索..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            aria-label="検索キーワード"
          />
        </div>

        <div className="mt-3 max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              読み込み中...
            </p>
          )}

          {error && (
            <p className="py-4 text-center text-sm text-red-500">{error}</p>
          )}

          {!isLoading && !error && query.trim().length > 0 && (
            <>
              {results.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  「{query}」に一致する記事が見つかりませんでした
                </p>
              ) : (
                <ul className="space-y-2">
                  {results.map((result) => (
                    <li key={result.slug}>
                      <Link
                        href={paths.post.getHref(result.slug)}
                        onClick={onClose}
                        className="block rounded-md p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="block font-medium text-gray-900 dark:text-gray-100">
                          {result.title}
                        </span>
                        <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                          {result.description}
                        </span>
                        {result.tags.length > 0 && (
                          <span className="mt-1 flex flex-wrap gap-1">
                            {result.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {!isLoading && !error && query.trim().length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              キーワードを入力して検索
            </p>
          )}
        </div>

        <div className="mt-3 flex justify-end border-t border-gray-200 pt-3 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            閉じる
          </button>
        </div>
      </div>
    </dialog>
  );
};
