'use client';

import { ErrorMessage } from '@/components/error/ErrorMessage';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const pathname = usePathname();

  useEffect(() => {
    console.error('[ERROR] Route error boundary caught error', {
      error,
      component: 'RouteErrorBoundary',
      digest: error.digest,
      pathname,
      timestamp: new Date().toISOString(),
    });
  }, [error, pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ErrorMessage error={error} />
    </div>
  );
}
