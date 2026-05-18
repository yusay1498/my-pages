import { SITE_TITLE } from '@/config/site';
import {
  OGP_IMAGE_CONTENT_TYPE,
  OGP_IMAGE_SIZE,
  createOgpImageResponse,
} from '@/features/seo/lib/og-image';

export const size = OGP_IMAGE_SIZE;
export const contentType = OGP_IMAGE_CONTENT_TYPE;

const OpengraphImage = () => {
  return createOgpImageResponse({
    title: `Projects - ${SITE_TITLE}`,
    description: 'パブリックリポジトリの一覧',
  });
};

export default OpengraphImage;
