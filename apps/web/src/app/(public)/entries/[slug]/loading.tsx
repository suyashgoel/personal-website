import { Skeleton } from '@/components/ui/skeleton';

export default function EntryPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 md:pt-20 md:pb-32 lg:px-8">
      <header className="mb-12">
        <Skeleton className="h-12 w-3/4 sm:h-14 md:h-16" />
      </header>

      <div className="mb-12 overflow-hidden rounded-md border border-hairline">
        <Skeleton className="w-full aspect-video" />
      </div>

      <section className="space-y-4">
        <Skeleton className="h-6 w-full sm:h-7" />
        <Skeleton className="h-6 w-full sm:h-7" />
        <Skeleton className="h-6 w-11/12 sm:h-7" />
        <Skeleton className="h-6 w-full sm:h-7" />
        <Skeleton className="h-6 w-full sm:h-7" />
        <Skeleton className="h-6 w-4/5 sm:h-7" />
        <Skeleton className="h-6 w-full sm:h-7" />
        <Skeleton className="h-6 w-9/12 sm:h-7" />
      </section>

      <section className="mt-16 pt-12">
        <div className="flex flex-col sm:flex-row justify-end items-start">
          <div className="flex flex-col gap-8 w-full sm:w-auto sm:min-w-72">
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <div className="flex flex-col gap-2.5">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-11/12" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-3 w-28" />
              <div className="flex flex-col gap-2.5">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-10/12" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
