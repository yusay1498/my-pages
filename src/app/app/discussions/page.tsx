import { Suspense } from 'react';

import { Spinner } from '@/components/ui/spinner';

import { Discussions } from './_components/discussions';

export const metadata = {
  title: 'Discussions',
  description: 'Discussions',
};

const DiscussionsPage = () => {
  // Static export does not support searchParams
  // Components using useSearchParams() must be wrapped with Suspense
  return (
    <Suspense fallback={<Spinner />}>
      <Discussions />
    </Suspense>
  );
};

export default DiscussionsPage;
