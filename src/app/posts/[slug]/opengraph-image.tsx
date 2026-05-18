import { notFound } from 'next/navigation';

import {
  OGP_IMAGE_CONTENT_TYPE,
  OGP_IMAGE_SIZE,
  createOgpImageResponse,
} from '@/features/seo/lib/og-image';
import { getAllSlugs, getPostMetaBySlug } from '@/features/blog/lib/posts';

export const size = OGP_IMAGE_SIZE;
export const contentType = OGP_IMAGE_CONTENT_TYPE;
export const dynamicParams = false;

const PLACEHOLDER_SLUG = '__placeholder__';

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

  return createOgpImageResponse({
    title: meta.title,
    description: meta.description,
  });
};

export default OpengraphImage;
