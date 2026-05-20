'use client';

import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';

import { SearchDialog } from '@/features/search/components/SearchDialog';

export const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        aria-label="検索"
      >
        <Search size={20} />
      </button>
      <SearchDialog isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
