import { Discussion } from '@/app/app/discussions/[discussionId]/_components/discussion';

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

export const dynamicParams = true;

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
