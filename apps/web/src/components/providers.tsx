'use client';

import { ApiError } from '@/lib/api/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60 * 24, // 24 hours
            retry: (failureCount, error) => {
              if (
                error instanceof ApiError &&
                error.statusCode >= 400 &&
                error.statusCode < 500
              ) {
                // Don't retry on 4xx errors (client errors)
                return false;
              }
              // Retry up to 2 times for network/server errors
              return failureCount < 2;
            },
            retryDelay: attemptIndex => 1000 * 2 ** attemptIndex,
            refetchOnWindowFocus: false, // Don't refetch when user switches tabs
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>{children}</JotaiProvider>
    </QueryClientProvider>
  );
}
