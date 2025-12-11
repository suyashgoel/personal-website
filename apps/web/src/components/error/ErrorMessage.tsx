import { ApiError } from '@/lib/api/client';
import { ErrorMessageProps } from '@/lib/types/types';

export function ErrorMessage({ error }: ErrorMessageProps) {
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'An unexpected error occurred';

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10 text-center space-y-4">
      <h1 className="text-2xl sm:text-3xl font-semibold">
        Something went wrong
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
    </main>
  );
}
