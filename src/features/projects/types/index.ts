/** GitHub API から取得するリポジトリ情報の型定義 */
export type GitHubRepository = {
  readonly id: number;
  readonly name: string;
  readonly full_name: string;
  readonly html_url: string;
  readonly description: string | null;
  readonly language: string | null;
  readonly stargazers_count: number;
  readonly forks_count: number;
  readonly topics: readonly string[];
  readonly homepage: string | null;
  readonly updated_at: string;
  readonly created_at: string;
  readonly fork: boolean;
  readonly archived: boolean;
};

/** プロジェクトカードに表示する情報 */
export type ProjectCard = {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly language: string | null;
  readonly stars: number;
  readonly forks: number;
  readonly topics: readonly string[];
  readonly url: string;
  readonly homepage: string | null;
  readonly updatedAt: string;
};
