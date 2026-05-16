import PostCard from '@/features/blog/components/PostCard';
import { getAllPostSummaries } from '@/features/blog/lib/posts';

const HomePage = () => {
  const posts = getAllPostSummaries();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          Yusay&apos;s TIL
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          個人の学習アウトプットブログ
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          記事がまだありません。
        </p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
