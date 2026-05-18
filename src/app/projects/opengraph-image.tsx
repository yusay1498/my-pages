import { PROJECTS_DESCRIPTION, PROJECTS_TITLE } from '@/config/site';
import {
  OGP_IMAGE_CONTENT_TYPE,
  OGP_IMAGE_SIZE,
  createOgpImage,
} from '@/features/seo/lib/og-image';

export const size = OGP_IMAGE_SIZE;
export const contentType = OGP_IMAGE_CONTENT_TYPE;
export const dynamic = 'force-static';

const OpengraphImage = () => {
  return createOgpImage({
    title: PROJECTS_TITLE,
    description: PROJECTS_DESCRIPTION,
  });
};

export default OpengraphImage;
