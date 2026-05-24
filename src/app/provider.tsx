'use client';

import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { ToastProvider } from '@/components/ui/toast';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ToastProvider>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        {children}
      </ErrorBoundary>
    </ToastProvider>
  );
};
