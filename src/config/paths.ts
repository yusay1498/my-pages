export const paths = {
  home: {
    getHref: () => '/',
  },
  rss: {
    getHref: () => '/rss.xml',
  },
  post: {
    getHref: (slug: string) => `/posts/${encodeURIComponent(slug)}`,
  },
  projects: {
    getHref: () => '/projects',
  },
} as const;
