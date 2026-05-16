import type { TocItem } from '@/features/blog/types';

type TableOfContentsProps = {
  readonly items: readonly TocItem[];
};

const TableOfContents = ({ items }: TableOfContentsProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="目次" className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        目次
      </h2>
      <ol className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-gray-500"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
