import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchPublicRepositories } from '@/features/projects/lib/github';

/** 有効な GitHub API レスポンスのスタブ */
const createRepoStub = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  name: 'test-repo',
  full_name: 'yusay1498/test-repo',
  html_url: 'https://github.com/yusay1498/test-repo',
  description: 'A test repo',
  language: 'TypeScript',
  stargazers_count: 5,
  forks_count: 1,
  topics: ['nextjs'],
  homepage: 'https://example.com',
  updated_at: '2026-01-01T00:00:00Z',
  created_at: '2025-01-01T00:00:00Z',
  fork: false,
  archived: false,
  ...overrides,
});

describe('fetchPublicRepositories', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('API リクエスト失敗時は空配列を返す', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchPublicRepositories();

    expect(result).toEqual([]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('成功時にリポジトリ一覧を ProjectCard 形式で返す', async () => {
    const repo = createRepoStub();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([repo]),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchPublicRepositories();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      name: 'test-repo',
      description: 'A test repo',
      language: 'TypeScript',
      stars: 5,
      forks: 1,
      topics: ['nextjs'],
      url: 'https://github.com/yusay1498/test-repo',
      homepage: 'https://example.com',
      updatedAt: '2026-01-01T00:00:00Z',
    });
  });

  it('fork と archived のリポジトリを除外する', async () => {
    const repos = [
      createRepoStub({ id: 1, name: 'normal', fork: false, archived: false }),
      createRepoStub({ id: 2, name: 'forked', fork: true, archived: false }),
      createRepoStub({
        id: 3,
        name: 'archived',
        fork: false,
        archived: true,
      }),
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(repos),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchPublicRepositories();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('normal');
  });

  it('バリデーション失敗時は空配列を返す', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ invalid: 'data' }]),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchPublicRepositories();

    expect(result).toEqual([]);
  });

  it('ネットワークエラー時は空配列を返す', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchPublicRepositories();

    expect(result).toEqual([]);
  });

  it('updatedAt の降順でソートされる', async () => {
    const repos = [
      createRepoStub({
        id: 1,
        name: 'old',
        updated_at: '2025-01-01T00:00:00Z',
      }),
      createRepoStub({
        id: 2,
        name: 'new',
        updated_at: '2026-06-01T00:00:00Z',
      }),
      createRepoStub({
        id: 3,
        name: 'mid',
        updated_at: '2026-01-01T00:00:00Z',
      }),
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(repos),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchPublicRepositories();

    expect(result.map((r) => r.name)).toEqual(['new', 'mid', 'old']);
  });

  it('GITHUB_TOKEN が設定されている場合 Authorization ヘッダーを送信する', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    vi.stubGlobal('fetch', fetchMock);

    await fetchPublicRepositories();

    const headers = fetchMock.mock.calls[0][1]?.headers as Record<
      string,
      string
    >;
    expect(headers.Authorization).toBe('Bearer test-token');
  });
});
