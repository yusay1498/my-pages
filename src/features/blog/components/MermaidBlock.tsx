'use client';

import DOMPurify from 'isomorphic-dompurify';
import mermaid from 'mermaid';
import { useEffect, useId, useState } from 'react';

type MermaidBlockProps = {
  readonly code: string;
};

/** mermaidコードの1行目からダイアグラム種別を抽出する（例: "flowchart LR" → "flowchart"） */
function extractDiagramType(code: string): string {
  const firstLine = code.trim().split('\n')[0]?.trim() ?? '';
  const diagramType = firstLine.split(/\s+/)[0] ?? '';
  return diagramType || 'Mermaid';
}

const MermaidBlock = ({ code }: MermaidBlockProps) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const id = useId();
  // useId() は ':r0:' 形式を返すため、有効な CSS ID に変換する
  const diagramId = `mermaid-${id.replace(/:/g, '')}`;

  useEffect(() => {
    let cancelled = false;

    // ダークモード判定はレンダリングのたびに行い、テーマ変更に追従させる
    // mermaid.initialize() は複数回呼んでも安全
    const isDark =
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: isDark ? 'dark' : 'default',
    });

    mermaid
      .render(diagramId, code)
      .then(({ svg: renderedSvg }) => {
        if (cancelled) return;
        // mermaid の securityLevel:'strict' に加え DOMPurify でも SVG をサニタイズする
        const safeSvg = DOMPurify.sanitize(renderedSvg, {
          USE_PROFILES: { svg: true, svgFilters: true },
        });
        setSvg(safeSvg);
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
      <pre
        role="alert"
        aria-label="ダイアグラムの描画に失敗しました"
        className="rounded bg-gray-100 p-4 text-sm text-red-600 dark:bg-gray-800 dark:text-red-400"
      >
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

  const diagramType = extractDiagramType(code);

  return (
    <div
      role="img"
      aria-label={`${diagramType} ダイアグラム`}
      className="my-4 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidBlock;
