import { ReactNode } from 'react';

import { Discussion } from './_components/discussion';

export const metadata = {
  title: 'Discussion',
  description: 'Discussion page',
};

export async function generateStaticParams() {
  // 静的エクスポートの場合は最低限1つのパラメータを返す
  // 実際の環境では実際のディスカッションIDの配列を返すべき
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
