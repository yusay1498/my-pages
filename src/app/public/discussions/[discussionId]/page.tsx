import { ReactNode } from 'react';

import { Discussion } from '@/app/app/discussions/[discussionId]/_components/discussion';

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
