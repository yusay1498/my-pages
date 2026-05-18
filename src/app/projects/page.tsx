import type { Metadata } from 'next';

import { paths } from '@/config/paths';
import {
  OPEN_GRAPH_LOCALE,
  OPEN_GRAPH_TYPE_WEBSITE,
  PROJECTS_DESCRIPTION,
  PROJECTS_TITLE,
  SITE_TITLE,
  toAbsoluteSiteUrl,
} from '@/config/site';
import ProjectCard from '@/features/projects/components/ProjectCard';
import { fetchPublicRepositories } from '@/features/projects/lib/github';
import { OGP_IMAGE_SIZE } from '@/features/seo/lib/og-image';

export const metadata: Metadata = {
  title: PROJECTS_TITLE,
  description: PROJECTS_DESCRIPTION,
  alternates: {
    canonical: toAbsoluteSiteUrl(paths.projects.getHref()),
  },
  openGraph: {
    type: OPEN_GRAPH_TYPE_WEBSITE,
    locale: OPEN_GRAPH_LOCALE,
    title: PROJECTS_TITLE,
    description: PROJECTS_DESCRIPTION,
    siteName: SITE_TITLE,
    url: toAbsoluteSiteUrl(paths.projects.getHref()),
    images: [
      {
        url: toAbsoluteSiteUrl(paths.projects.getOgpImageHref()),
        width: OGP_IMAGE_SIZE.width,
        height: OGP_IMAGE_SIZE.height,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PROJECTS_TITLE,
    description: PROJECTS_DESCRIPTION,
    images: [toAbsoluteSiteUrl(paths.projects.getOgpImageHref())],
  },
};

const ProjectsPage = async () => {
  const projects = await fetchPublicRepositories();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          Projects
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          GitHub で公開しているリポジトリの一覧です。
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          リポジトリが見つかりませんでした。
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
