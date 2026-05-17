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
