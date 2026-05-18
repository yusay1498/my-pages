import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { getAllPosts } from '@/features/blog/lib/posts';
import type { SearchIndexEntry } from '@/features/search/types';

const outputDirName = process.env.NEXT_OUTPUT_DIR ?? 'out';
const outputDirPath = path.resolve(process.cwd(), outputDirName);
const outputPath = path.join(outputDirPath, 'search-index.json');

try {
  const posts = getAllPosts();
  const searchIndex: SearchIndexEntry[] = posts.map((post) => ({
    slug: post.slug,
    title: post.meta.title,
    description: post.meta.description,
    tags: [...post.meta.tags],
    content: post.articles.map((article) => article.content).join('\n'),
  }));

  mkdirSync(outputDirPath, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(searchIndex), 'utf-8');

  console.info(`Generated: ${outputPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `Failed to generate search index at ${outputPath}: ${message}`,
  );
  process.exit(1);
}
