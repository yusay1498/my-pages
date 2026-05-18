import { SITE_DESCRIPTION, SITE_TITLE } from '@/config/site';
import {
  OGP_IMAGE_CONTENT_TYPE,
  OGP_IMAGE_SIZE,
  createOgpImageResponse,
} from '@/features/seo/lib/og-image';

export const size = OGP_IMAGE_SIZE;
export const contentType = OGP_IMAGE_CONTENT_TYPE;
export const dynamic = 'force-static';

const OpengraphImage = () => {
  return createOgpImageResponse({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  });
};

export default OpengraphImage;
