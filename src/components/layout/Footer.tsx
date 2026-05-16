/** 現在の年はビルド時（static export）に確定する */
const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 py-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {CURRENT_YEAR} Yusay. All rights reserved.
        </p>
        <a
          href="https://github.com/yusay1498/my-pages"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHubリポジトリ（新しいウィンドウで開く）"
          className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};
