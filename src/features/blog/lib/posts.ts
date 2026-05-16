import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import type { Article, Post, PostMeta } from '@/features/blog/types';

const POSTS_DIR = path.join(process.cwd(), 'posts');
const ARTICLE_FILE_PATTERN = /^(\d+)\..+\.md$/;

const postMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  status: z.enum(['draft', 'published']),
});

const readPostMeta = (slug: string): PostMeta => {
  const metaPath = path.join(POSTS_DIR, slug, 'meta.json');
  const rawMeta = readFileSync(metaPath, 'utf-8');
  return postMetaSchema.parse(JSON.parse(rawMeta));
};

const readPostArticles = (slug: string): Article[] => {
  const postDir = path.join(POSTS_DIR, slug);

  return readdirSync(postDir)
    .filter((filename) => ARTICLE_FILE_PATTERN.test(filename))
    .map((filename) => {
      const matched = filename.match(ARTICLE_FILE_PATTERN);
      if (!matched) {
        throw new Error(`Invalid article filename: ${filename}`);
      }

      return {
        filename,
        number: Number(matched[1]),
        content: readFileSync(path.join(postDir, filename), 'utf-8'),
      } satisfies Article;
    })
    .sort((a, b) => a.number - b.number);
};

const getAllPostDirectories = (): string[] => {
  try {
    return readdirSync(POSTS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
};

export const getPostBySlug = (slug: string): Post | null => {
  const allSlugs = getAllPostDirectories();
  if (!allSlugs.includes(slug)) {
    return null;
  }

  return {
    slug,
    meta: readPostMeta(slug),
    articles: readPostArticles(slug),
  };
};

export const getAllPosts = (): Post[] => {
  return getAllPostDirectories()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .filter((post) => post.meta.status === 'published')
    .sort((a, b) => b.meta.updatedAt.localeCompare(a.meta.updatedAt));
};

export const getAllSlugs = (): string[] => {
  return getAllPosts().map((post) => post.slug);
};
