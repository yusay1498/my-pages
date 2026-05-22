'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TOAST_DURATION_MS, useToast } from '@/components/ui/toast';

type CodeBlockProps = {
  readonly code: string;
  readonly language?: string;
};

const COPIED_LABEL_RESET_MS = TOAST_DURATION_MS;

const copyByExecCommand = (value: string): boolean => {
  if (typeof document.execCommand !== 'function') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    textarea.remove();
  }
};

const copyToClipboard = async (value: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // clipboard API が失敗した場合はフォールバックへ
    }
  }

  return copyByExecCommand(value);
};

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  const displayLanguage = useMemo(
    () => language?.trim().split(/\s+/)[0]?.toLowerCase() || 'text',
    [language],
  );
  const languageClassName =
    displayLanguage === 'text' ? '' : `language-${displayLanguage}`;

  const handleCopy = useCallback(async () => {
    const copied = await copyToClipboard(code);

    if (!copied) {
      showToast({
        message: 'コピーに失敗しました',
        variant: 'error',
      });
      return;
    }

    setIsCopied(true);
    showToast({ message: 'コードをコピーしました', variant: 'success' });

    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setIsCopied(false);
      resetTimerRef.current = null;
    }, COPIED_LABEL_RESET_MS);
  }, [code, showToast]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="not-prose my-4 overflow-hidden rounded-md border border-gray-200 bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
        <span className="text-xs font-medium tracking-wide text-gray-300 uppercase">
          {displayLanguage}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded border border-gray-600 px-2 py-1 text-xs font-medium text-gray-100 transition-colors hover:bg-gray-700 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:outline-none"
          aria-label="コードをコピー"
        >
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-4">
        <code className={`text-sm text-gray-100 ${languageClassName}`.trim()}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
