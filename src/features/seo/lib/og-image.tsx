import { ImageResponse } from 'next/og';

import { SITE_TITLE } from '@/config/site';

export const OGP_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OGP_IMAGE_CONTENT_TYPE = 'image/png';

export const OGP_GRADIENT =
  'linear-gradient(135deg, rgb(17, 24, 39), rgb(31, 41, 55) 45%, rgb(59, 130, 246))';
export const OGP_IMAGE_PADDING = '56px';
export const OGP_IMAGE_FONT_FAMILY =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

type OgpImageParams = {
  readonly title: string;
  readonly description: string;
};

export const createOgpImage = ({
  title,
  description,
}: OgpImageParams): ImageResponse => {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: OGP_GRADIENT,
        color: 'white',
        padding: OGP_IMAGE_PADDING,
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: OGP_IMAGE_FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '8px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            fontSize: '26px',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          {SITE_TITLE}
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: '64px',
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '34px',
            lineHeight: 1.4,
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {description}
        </p>
      </div>
    </div>,
    OGP_IMAGE_SIZE,
  );
};
