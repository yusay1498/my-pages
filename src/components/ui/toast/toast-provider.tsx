'use client';

import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Dispatch, ReactNode } from 'react';

type ToastVariant = 'success' | 'error';

type ToastItem = {
  readonly id: string;
  readonly message: string;
  readonly variant: ToastVariant;
};

type ToastInput = {
  readonly message: string;
  readonly variant?: ToastVariant;
};

type ToastContextValue = {
  readonly showToast: Dispatch<ToastInput>;
};

export const TOAST_DURATION_MS = 2400;

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  readonly children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([]);
  const timeoutIdsRef = useRef(new Set<number>());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, variant = 'success' }: ToastInput) => {
      const id =
        typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      const timeoutId = window.setTimeout(() => {
        removeToast(id);
        timeoutIdsRef.current.delete(timeoutId);
      }, TOAST_DURATION_MS);
      timeoutIdsRef.current.add(timeoutId);
    },
    [removeToast],
  );

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;
    return () => {
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutIds.clear();
    };
  }, []);

  const contextValue = useMemo(
    () => ({ showToast }),
    [showToast],
  ) satisfies ToastContextValue;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-xs flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.variant === 'error' ? 'alert' : 'status'}
            className={
              toast.variant === 'success'
                ? 'rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 shadow-md dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100'
                : 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 shadow-md dark:border-red-800 dark:bg-red-950 dark:text-red-100'
            }
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
