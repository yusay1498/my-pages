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
    expect(toAbsoluteSiteUrl('projects')).toBe('https://example.com/projects');
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
    expect(toAbsoluteSiteUrl('/about')).toBe(
      'https://example.com/my-pages/about',
    );
  });

  it('NEXT_PUBLIC_GISCUS_REPO が未指定の場合は既定値を使う', async () => {
    vi.stubEnv('GITHUB_USERNAME', 'octocat');
    vi.stubEnv('NEXT_PUBLIC_REPOSITORY_NAME', 'hello-world');

    const { GISCUS_REPO } = await import('@/config/site');

    expect(GISCUS_REPO).toBe('octocat/hello-world');
  });

  it('NEXT_PUBLIC_GISCUS_REPO が空文字の場合は既定値を使う', async () => {
    vi.stubEnv('GITHUB_USERNAME', 'octocat');
    vi.stubEnv('NEXT_PUBLIC_REPOSITORY_NAME', 'hello-world');
    vi.stubEnv('NEXT_PUBLIC_GISCUS_REPO', '   ');

    const { GISCUS_REPO } = await import('@/config/site');

    expect(GISCUS_REPO).toBe('octocat/hello-world');
  });

  it('NEXT_PUBLIC_GISCUS_REPO が不正な形式の場合は無効化する', async () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_GISCUS_REPO', 'owner/repo/extra');

    const { GISCUS_REPO } = await import('@/config/site');

    expect(GISCUS_REPO).toBe('');
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy.mock.calls[0]?.[0]).toContain(
      'NEXT_PUBLIC_GISCUS_REPO が不正なためコメント機能を無効化します',
    );
    consoleWarnSpy.mockRestore();
  });
});
