import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CodeBlock from '@/features/blog/components/CodeBlock';

const showToast = vi.fn();

vi.mock('@/components/ui/toast', () => ({
  TOAST_DURATION_MS: 2400,
  useToast: () => ({ showToast }),
}));

describe('CodeBlock', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(true),
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    showToast.mockReset();
  });

  it('クリップボードAPIでコピーし成功トーストを表示する', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<CodeBlock code={'const value = 1;'} language="ts" />);
    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('const value = 1;');
      expect(showToast).toHaveBeenCalledWith({
        message: 'コードをコピーしました',
        variant: 'success',
      });
    });

    expect(screen.getByText('Copied')).toBeTruthy();
  });

  it('クリップボードAPI失敗時はexecCommandでフォールバックする', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    const execCommandSpy = vi.fn().mockReturnValue(true);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    Object.defineProperty(document, 'execCommand', {
      value: execCommandSpy,
      configurable: true,
    });

    render(<CodeBlock code={'console.log("fallback");'} language="js" />);
    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    await waitFor(() => {
      expect(execCommandSpy).toHaveBeenCalledWith('copy');
      expect(showToast).toHaveBeenCalledWith({
        message: 'コードをコピーしました',
        variant: 'success',
      });
    });
  });

  it('コピー失敗時はエラートーストを表示する', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    const execCommandSpy = vi.fn().mockReturnValue(false);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    Object.defineProperty(document, 'execCommand', {
      value: execCommandSpy,
      configurable: true,
    });

    render(<CodeBlock code={'echo "fail"'} language="sh" />);
    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'コピーに失敗しました',
        variant: 'error',
      });
    });
  });
});
