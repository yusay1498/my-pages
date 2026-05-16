'use client';

import dynamic from 'next/dynamic';

// mermaid は大きな依存（d3/cytoscape等を含む）のため
// ssr: false で遅延読み込みし、mermaid を含まないページのバンドルを削減する
const MermaidBlockLazy = dynamic(() => import('./MermaidBlock'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse rounded bg-gray-100 p-8 dark:bg-gray-800" />
  ),
});

export default MermaidBlockLazy;
