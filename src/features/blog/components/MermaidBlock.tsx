'use client';

import mermaid from 'mermaid';
import { useEffect, useId, useState } from 'react';

type MermaidBlockProps = {
  readonly code: string;
};

// mermaid は一度だけ初期化する（テーマはシステム設定を参照）
let mermaidInitialized = false;

function ensureMermaidInitialized(): void {
  if (mermaidInitialized) return;
  const isDark =
    document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: isDark ? 'dark' : 'default',
  });
  mermaidInitialized = true;
}

const MermaidBlock = ({ code }: MermaidBlockProps) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const id = useId();
  // useId() は ':r0:' 形式を返すため、有効な CSS ID に変換する
  const diagramId = `mermaid-${id.replace(/:/g, '')}`;

  useEffect(() => {
    let cancelled = false;

    ensureMermaidInitialized();

    mermaid
      .render(diagramId, code)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) setSvg(renderedSvg);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error('Mermaid rendering failed:', err);
          setHasError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, diagramId]);

  if (hasError) {
    return (
      <pre className="rounded bg-gray-100 p-4 text-sm text-red-600 dark:bg-gray-800 dark:text-red-400">
        {code}
      </pre>
    );
  }

  if (svg === null) {
    return (
      <pre className="rounded bg-gray-100 p-4 text-sm dark:bg-gray-800">
        {code}
      </pre>
    );
  }

  return (
    <div
      role="img"
      aria-label="Mermaidダイアグラム"
      className="my-4 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidBlock;
