import { describe, expect, it, vi } from 'vitest';

import { fetchPublicRepositories } from '@/features/projects/lib/github';

describe('fetchPublicRepositories', () => {
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
    vi.unstubAllGlobals();
  });
});
