import { ApiError } from '@/lib/api/client';
import { ErrorMessageProps } from '@/lib/types/types';
import Link from 'next/link';

export function ErrorMessage({ error }: ErrorMessageProps) {
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'An unexpected error occurred';

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-light tracking-tight text-primary sm:text-5xl md:text-5xl">
          Something went wrong
        </h1>
        <p className="text-pretty text-base font-light text-foreground/90 sm:text-lg md:text-xl">
          {message}
        </p>
      </header>

      <div className="text-center">
        <Link
          href="/search"
          className="inline-flex items-center font-light text-base text-muted-foreground transition-colors hover:opacity-80 sm:text-lg"
        >
          Return to search
        </Link>
      </div>
    </div>
  );
}
