import {
  OGP_IMAGE_CONTENT_TYPE,
  OGP_IMAGE_SIZE,
  createOgpImageResponse,
} from '@/features/seo/lib/og-image';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/config/site';

export const size = OGP_IMAGE_SIZE;
export const contentType = OGP_IMAGE_CONTENT_TYPE;

const OpengraphImage = () => {
  return createOgpImageResponse({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  });
};

export default OpengraphImage;
