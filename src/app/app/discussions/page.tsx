import { Suspense } from 'react';

import { Spinner } from '@/components/ui/spinner';

import { Discussions } from './_components/discussions';

export const metadata = {
  title: 'Discussions',
  description: 'Discussions',
};

const DiscussionsPage = () => {
  // 静的エクスポートではsearchParamsは使用できない
  // useSearchParams()を使用するコンポーネントはSuspenseでラップする
  return (
    <Suspense fallback={<Spinner />}>
      <Discussions />
    </Suspense>
  );
};

export default DiscussionsPage;
