import { ExternalLink, GitFork, Star } from 'lucide-react';

import type { ProjectCard as ProjectCardType } from '@/features/projects/types';

import { LanguageBadge } from './LanguageBadge';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/** 許可されたプロトコルの URL かどうかを判定する */
const isSafeUrl = (url: string): boolean => {
  try {
    return ALLOWED_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
};

type ProjectCardProps = {
  readonly project: ProjectCardType;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const updatedAtDisplay = new Date(project.updatedAt)
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replaceAll('-', '/');

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {project.name}
        </h2>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} のリポジトリを開く（新しいウィンドウ）`}
          className="shrink-0 text-gray-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ExternalLink className="size-4" />
        </a>
      </div>

      {project.description ? (
        <p className="mt-2 grow text-sm text-gray-600 dark:text-gray-300">
          {project.description}
        </p>
      ) : (
        <div className="grow" />
      )}

      {project.topics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="トピック">
          {project.topics.map((topic) => (
            <li
              key={topic}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        {project.language && <LanguageBadge language={project.language} />}

        {project.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star className="size-3.5" aria-hidden="true" />
            <span className="sr-only">スター数:</span>
            {project.stars}
          </span>
        )}

        {project.forks > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="size-3.5" aria-hidden="true" />
            <span className="sr-only">フォーク数:</span>
            {project.forks}
          </span>
        )}

        <span className="ml-auto text-xs">
          <span className="sr-only">更新日:</span>
          <time dateTime={project.updatedAt}>{updatedAtDisplay}</time>
        </span>
      </div>

      {project.homepage && isSafeUrl(project.homepage) && (
        <a
          href={project.homepage}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} のサイトを見る（新しいウィンドウで開く）`}
          className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          サイトを見る
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      )}
    </article>
  );
};

export default ProjectCard;
