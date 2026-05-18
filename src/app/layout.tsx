import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { AppProvider } from '@/app/provider';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { paths } from '@/config/paths';
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  toAbsoluteSiteUrl,
} from '@/config/site';
import { OGP_IMAGE_SIZE } from '@/features/seo/lib/og-image';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_TITLE,
    url: toAbsoluteSiteUrl(paths.home.getHref()),
    images: [
      {
        url: toAbsoluteSiteUrl(paths.home.getOgpImageHref()),
        width: OGP_IMAGE_SIZE.width,
        height: OGP_IMAGE_SIZE.height,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [toAbsoluteSiteUrl(paths.home.getOgpImageHref())],
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <AppProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
