'use client';

import Giscus from '@giscus/react';
import { usePathname } from 'next/navigation';

import {
  BASE_PATH,
  GISCUS_CATEGORY,
  GISCUS_CATEGORY_ID,
  GISCUS_REPO,
  GISCUS_REPO_ID,
} from '@/config/site';

const toDiscussionTerm = (pathname: string, basePath: string): string => {
  if (pathname === '/') {
    return '/';
  }

  if (!basePath) {
    return pathname;
  }

  if (pathname === basePath) {
    return '/';
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length);
  }

  return pathname;
};

/**
 * GitHub Discussions ベースのコメントウィジェット（giscus）。
 * クライアント側でのみ描画されるため 'use client' が必要。
 *
 * GISCUS_REPO_ID / GISCUS_CATEGORY_ID が未設定の場合は何も表示しない。
 * これらの値は giscus.app で取得し、環境変数に設定する必要がある。
 */
export default function GiscusWidget() {
  const pathname = usePathname();
  const discussionTerm = toDiscussionTerm(pathname, BASE_PATH);

  if (!GISCUS_REPO || !GISCUS_REPO_ID || !GISCUS_CATEGORY_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[GiscusWidget] giscus 設定が不足または不正なため、コメント欄を表示しません。',
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
      mapping="specific"
      term={discussionTerm}
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
