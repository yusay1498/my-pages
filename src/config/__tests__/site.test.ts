import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('site config', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('basePath なしでも絶対URLを組み立てる', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com');
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');

    const { toAbsoluteSiteUrl } = await import('@/config/site');

    expect(toAbsoluteSiteUrl('/')).toBe('https://example.com');
    expect(toAbsoluteSiteUrl('/projects')).toBe('https://example.com/projects');
  });

  it('basePath ありでbasePath重複を避けて絶対URLを組み立てる', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com/my-pages');
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/my-pages');

    const { toAbsoluteSiteUrl } = await import('@/config/site');

    expect(toAbsoluteSiteUrl('/')).toBe('https://example.com/my-pages');
    expect(toAbsoluteSiteUrl('/projects')).toBe(
      'https://example.com/my-pages/projects',
    );
    expect(toAbsoluteSiteUrl('/my-pages')).toBe('https://example.com/my-pages');
    expect(toAbsoluteSiteUrl('/my-pages/projects')).toBe(
      'https://example.com/my-pages/projects',
    );
  });
});
