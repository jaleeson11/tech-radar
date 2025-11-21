'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          // Global SWR configuration
          revalidateOnFocus: true,
          revalidateOnReconnect: true,
          shouldRetryOnError: true,
          errorRetryCount: 3,
          errorRetryInterval: 5000,
          dedupingInterval: 2000,
          // Keep data fresh but don't make it too aggressive
          focusThrottleInterval: 5000,
          // Enable suspense for better loading states (optional)
          suspense: false,
          onError: (error, key) => {
            // Global error handler for SWR
            console.error('SWR Error:', key, error);
          },
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
