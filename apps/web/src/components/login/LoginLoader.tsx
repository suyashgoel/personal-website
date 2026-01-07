import { Skeleton } from '../ui/skeleton';

export function LoginLoader() {
  return (
    <div className="w-full mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8 flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <header className="mb-10">
          <Skeleton className="h-14 w-32 mb-2" />
          <Skeleton className="h-6 w-48" />
        </header>

        <div className="space-y-5">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
