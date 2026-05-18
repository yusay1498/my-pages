export const paths = {
  home: {
    getHref: () => '/',
    getOgpImageHref: () => '/opengraph-image.png',
  },
  rss: {
    getHref: () => '/rss.xml',
  },
  post: {
    getHref: (slug: string) => `/posts/${encodeURIComponent(slug)}`,
    getOgpImageHref: (slug: string) =>
      `/posts/${encodeURIComponent(slug)}/opengraph-image.png`,
  },
  projects: {
    getHref: () => '/projects',
    getOgpImageHref: () => '/projects/opengraph-image.png',
  },
} as const;
