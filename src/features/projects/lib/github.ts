import type { GitHubRepository, ProjectCard } from '@/features/projects/types';

const GITHUB_USERNAME = 'yusay1498';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub API からパブリックリポジトリ一覧を取得する。
 * ビルド時（Static Export）に呼び出されることを前提としている。
 * API が利用不可の場合は空配列を返す（ビルドを止めない）。
 */
export const fetchPublicRepositories = async (): Promise<
  readonly ProjectCard[]
> => {
  const url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?type=public&sort=updated&per_page=100`;

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  // ビルド時に GITHUB_TOKEN が設定されていればレート制限を緩和
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.warn(
        `GitHub API request failed: ${response.status} ${response.statusText}. Falling back to empty list.`,
      );
      return [];
    }

    const repositories: GitHubRepository[] = await response.json();

    return repositories
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
