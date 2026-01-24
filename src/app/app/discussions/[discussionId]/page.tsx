import { Discussion } from './_components/discussion';

export const metadata = {
  title: 'Discussion',
  description: 'Discussion page',
};

export async function generateStaticParams() {
  // 静的エクスポート対象とするディスカッションIDの一覧
  // 本番環境では、実際のデータソースからディスカッションIDを取得するように変更してください
  const discussionIds = ['1', '2', '3'];

  return discussionIds.map((id) => ({ discussionId: id }));
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
