import Link from 'next/link';

import type { Post } from '@/features/blog/types';

type Props = {
  post: Post;
};

const PostCard = ({ post }: Props) => {
  const updatedAtDisplay = post.meta.updatedAt.replaceAll('-', '/');

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <Link href={`/posts/${encodeURIComponent(post.slug)}`} className="group block">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {post.meta.title}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {post.meta.description}
        </p>
      </Link>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="記事のタグ">
        {post.meta.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        更新日: <time dateTime={post.meta.updatedAt}>{updatedAtDisplay}</time>
      </p>
    </article>
  );
};

export default PostCard;
