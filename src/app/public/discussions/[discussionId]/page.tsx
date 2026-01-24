import { ReactNode } from 'react';

import { Discussion } from '@/app/app/discussions/[discussionId]/_components/discussion';

export const metadata = {
  title: 'Discussion',
  description: 'Discussion page',
};

export async function generateStaticParams() {
  // 静的エクスポートの場合、最小限のパラメータセットを返します
  // 本番環境では、実際のデータソースからディスカッションIDを取得する必要があります
  // 現在はプレースホルダーとしてID '1'の単一ページのみを生成します
  return [{ discussionId: '1' }];
}

export const dynamicParams = false;

const PublicDiscussionPage = ({
  params: { discussionId },
}: {
  params: {
    discussionId: string;
  };
}) => {
  return <Discussion discussionId={discussionId} />;
};

export default PublicDiscussionPage;
