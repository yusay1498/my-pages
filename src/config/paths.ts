export const paths = {
  home: {
    getHref: () => '/',
  },
  post: {
    getHref: (slug: string) => `/posts/${encodeURIComponent(slug)}`,
  },
  projects: {
    getHref: () => '/projects',
  },
} as const;
