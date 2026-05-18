import { notFound } from 'next/navigation';

import { PLACEHOLDER_SLUG } from '@/features/blog/lib/constants';
import { getAllSlugs, getPostMetaBySlug } from '@/features/blog/lib/posts';
import {
  OGP_IMAGE_CONTENT_TYPE,
  OGP_IMAGE_SIZE,
  createOgpImage,
} from '@/features/seo/lib/og-image';

export const size = OGP_IMAGE_SIZE;
export const contentType = OGP_IMAGE_CONTENT_TYPE;
export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const slugs = getAllSlugs();

  return slugs.length > 0
    ? slugs.map((slug) => ({ slug }))
    : [{ slug: PLACEHOLDER_SLUG }];
}

type OgpImageParams = {
  readonly params: Promise<{ slug: string }>;
};

const OpengraphImage = async ({ params }: OgpImageParams) => {
  const { slug } = await params;
  const meta = getPostMetaBySlug(slug);

  if (!meta || meta.status !== 'published') {
    notFound();
  }

  return createOgpImage({
    title: meta.title,
    description: meta.description,
  });
};

export default OpengraphImage;
