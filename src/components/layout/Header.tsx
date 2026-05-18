import Link from 'next/link';

import { SITE_TITLE } from '@/config/site';
import { SearchButton } from '@/features/search/components/SearchButton';

export const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
        >
          {SITE_TITLE}
        </Link>
        <SearchButton />
      </div>
    </header>
  );
};
