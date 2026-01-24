import { ReactNode } from 'react';

import { Discussion } from './_components/discussion';

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

const DiscussionPage = ({
  params,
}: {
  params: {
    discussionId: string;
  };
}) => {
  const discussionId = params.discussionId;

  return <Discussion discussionId={discussionId} />;
};

export default DiscussionPage;
