import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { AppProvider } from '@/app/provider';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/config/site';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
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
