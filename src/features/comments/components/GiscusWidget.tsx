'use client';

import Giscus from '@giscus/react';

import {
  GISCUS_CATEGORY,
  GISCUS_CATEGORY_ID,
  GISCUS_REPO,
  GISCUS_REPO_ID,
} from '@/config/site';

/**
 * GitHub Discussions ベースのコメントウィジェット（giscus）。
 * クライアント側でのみ描画されるため 'use client' が必要。
 *
 * GISCUS_REPO_ID / GISCUS_CATEGORY_ID が未設定の場合は何も表示しない。
 * これらの値は giscus.app で取得し、環境変数に設定する必要がある。
 */
export default function GiscusWidget() {
  if (!GISCUS_REPO_ID || !GISCUS_CATEGORY_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[GiscusWidget] NEXT_PUBLIC_GISCUS_REPO_ID または NEXT_PUBLIC_GISCUS_CATEGORY_ID が未設定のため、コメント欄を表示しません。',
      );
    }
    return null;
  }

  return (
    <Giscus
      repo={GISCUS_REPO}
      repoId={GISCUS_REPO_ID}
      category={GISCUS_CATEGORY}
      categoryId={GISCUS_CATEGORY_ID}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      // ブラウザのカラースキーム設定に追従してダーク/ライトを自動切替
      theme="preferred_color_scheme"
      lang="ja"
      loading="lazy"
    />
  );
}
