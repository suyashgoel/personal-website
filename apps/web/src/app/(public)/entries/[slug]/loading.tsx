import { Skeleton } from '@/components/ui/skeleton';

export default function EntryPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10 lg:px-8">
      <header className="mb-6 w-full">
        <Skeleton className="h-8 w-3/4 sm:h-10 md:h-12" />
      </header>

      <div className="mb-8 overflow-hidden rounded-md border-hairline">
        <Skeleton className="w-full aspect-[4/3]" />
      </div>

      <section className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-9/12" />
      </section>

      <section className="mt-6 pt-4 border-t">
        <div className="flex flex-col sm:flex-row justify-end items-start">
          <div className="flex flex-col gap-4 w-full sm:w-auto sm:min-w-72">
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-3 w-28" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-10/12" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
