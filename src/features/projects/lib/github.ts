import { z } from 'zod';

import { GITHUB_USERNAME } from '@/config/site';
import type { ProjectCard } from '@/features/projects/types';

const GITHUB_API_BASE = 'https://api.github.com';

/** 1リクエストあたりの最大取得件数 */
const PER_PAGE = 100;

/** ページネーションの最大ページ数（安全弁） */
const MAX_PAGES = 10;

/** GitHub API レスポンスのバリデーションスキーマ */
const gitHubRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  topics: z.array(z.string()),
  homepage: z.string().url().nullable().catch(null),
  updated_at: z.string(),
  created_at: z.string(),
  fork: z.boolean(),
  archived: z.boolean(),
});

type GitHubRepository = z.infer<typeof gitHubRepositorySchema>;

const gitHubRepositoriesSchema = z.array(gitHubRepositorySchema);

/**
 * GitHub API からパブリックリポジトリ一覧を取得する。
 * ビルド時（Static Export）に呼び出されることを前提としている。
 * API が利用不可の場合は空配列を返す（ビルドを止めない）。
 * ページネーションに対応し、全ページ分のリポジトリを取得する。
 */
export const fetchPublicRepositories = async (): Promise<
  readonly ProjectCard[]
> => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  // ビルド時に GITHUB_TOKEN が設定されていればレート制限を緩和
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const allRepos: GitHubRepository[] = [];
    let page = 1;

    while (page <= MAX_PAGES) {
      const url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?type=public&sort=updated&per_page=${PER_PAGE}&page=${page}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.warn(
          `GitHub API request failed: ${response.status} ${response.statusText}. Falling back to empty list.`,
        );
        return [];
      }

      const json: unknown = await response.json();
      const parsed = gitHubRepositoriesSchema.safeParse(json);

      if (!parsed.success) {
        console.warn(
          'GitHub API response validation failed:',
          parsed.error.message,
        );
        return [];
      }

      allRepos.push(...parsed.data);

      // 取得件数が per_page 未満なら最終ページ
      if (parsed.data.length < PER_PAGE) break;
      page++;
    }

    return allRepos
      .filter((repo) => !repo.fork && !repo.archived)
      .map(toProjectCard)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch (error) {
    console.warn('Failed to fetch GitHub repositories:', error);
    return [];
  }
};

const toProjectCard = (repo: GitHubRepository): ProjectCard => ({
  id: repo.id,
  name: repo.name,
  description: repo.description,
  language: repo.language,
  stars: repo.stargazers_count,
  forks: repo.forks_count,
  topics: repo.topics,
  url: repo.html_url,
  homepage: repo.homepage,
  updatedAt: repo.updated_at,
});
