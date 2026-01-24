import { ReactNode } from 'react';

import { Discussion } from './_components/discussion';

export const metadata = {
  title: 'Discussion',
  description: 'Discussion page',
};

export async function generateStaticParams() {
  // For static export, return a minimal set of params
  // In production, this should fetch actual discussion IDs from your data source
  // Currently only generates a single page with ID '1' as a placeholder
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
