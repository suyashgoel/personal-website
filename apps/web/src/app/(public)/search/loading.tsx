import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPageSkeleton() {
  return (
    <main className="w-full mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8 flex-1 flex flex-col items-center justify-center">
      <div className="w-full">
        <header className="mb-10">
          <Skeleton className="mb-2 h-10 w-48 sm:h-12 md:h-14" />
          <Skeleton className="h-5 w-64 sm:h-6" />
        </header>

        <div className="space-y-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </main>
  );
}
