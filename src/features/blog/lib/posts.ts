import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import type { Article, Post, PostMeta, PostSummary } from '@/features/blog/types';

const POSTS_DIR = path.resolve(process.cwd(), 'posts');
const ARTICLE_FILE_PATTERN = /^(\d+)\.([a-z0-9-]+)\.md$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const ARTICLE_FORMAT = '{number}.{slug}.md (slug: [a-z0-9-]+)';

const postMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  createdAt: z.string().regex(DATE_PATTERN),
  updatedAt: z.string().regex(DATE_PATTERN),
  status: z.enum(['draft', 'published']),
});

const readPostMeta = (postDir: string): PostMeta => {
  const metaPath = path.join(postDir, 'meta.json');
  const rawMeta = readFileSync(metaPath, 'utf-8');
  return postMetaSchema.parse(JSON.parse(rawMeta));
};

const readPostArticles = (postDir: string, slug: string): Article[] => {
  return readdirSync(postDir)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const matched = filename.match(ARTICLE_FILE_PATTERN);
      if (!matched) {
        throw new Error(
          `Invalid article filename "${filename}" in posts/${slug}. Expected ${ARTICLE_FORMAT}.`,
        );
      }

      return {
        filename,
        number: Number.parseInt(matched[1], 10),
        content: readFileSync(path.join(postDir, filename), 'utf-8'),
      } satisfies Article;
    })
    .sort((a, b) => a.number - b.number);
};

const getAllPostDirectories = (): string[] => {
  try {
    return readdirSync(POSTS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((slug) => SLUG_PATTERN.test(slug));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }
};

const getPostDirBySlug = (slug: string): string | null => {
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }

  const postDir = path.join(POSTS_DIR, slug);

  try {
    return statSync(postDir).isDirectory() ? postDir : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }

    throw error;
  }
};

export const getPostBySlug = (slug: string): Post | null => {
  const postDir = getPostDirBySlug(slug);
  if (!postDir) {
    return null;
  }

  return {
    slug,
    meta: readPostMeta(postDir),
    articles: readPostArticles(postDir, slug),
  };
};

export const getAllPostSummaries = (): PostSummary[] => {
  return getAllPostDirectories()
    .map((slug) => {
      const postDir = path.join(POSTS_DIR, slug);
      const meta = readPostMeta(postDir);
      if (meta.status !== 'published') {
        return null;
      }

      return { slug, meta } satisfies PostSummary;
    })
    .filter((summary): summary is PostSummary => summary !== null)
    .sort((a, b) => b.meta.updatedAt.localeCompare(a.meta.updatedAt));
};

export const getAllPosts = (): Post[] => {
  return getAllPostDirectories()
    .map((slug) => {
      const postDir = path.join(POSTS_DIR, slug);
      const meta = readPostMeta(postDir);
      if (meta.status !== 'published') {
        return null;
      }

      return {
        slug,
        meta,
        articles: readPostArticles(postDir, slug),
      } satisfies Post;
    })
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.meta.updatedAt.localeCompare(a.meta.updatedAt));
};

export const getAllSlugs = (): string[] => {
  return getAllPostDirectories().filter((slug) => {
    const postDir = path.join(POSTS_DIR, slug);
    return readPostMeta(postDir).status === 'published';
  });
};
