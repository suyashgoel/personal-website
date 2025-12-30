import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 md:pt-20 md:pb-32 lg:px-8">
      <header className="mb-20">
        <Skeleton className="h-14 w-64 sm:h-16" />
      </header>

      <article className="mb-20 space-y-8 leading-relaxed">
        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '85%' }} />

        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '60%' }} />

        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '75%' }} />

        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-6 sm:h-7" style={{ width: '70%' }} />
      </article>

      <div className="mb-20 text-center">
        <Skeleton className="mx-auto h-5 w-40" />
      </div>

      <section className="pt-4">
        <Skeleton className="mb-10 h-9 w-32 sm:h-10" />
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </section>

      <footer className="mt-20 pt-12">
        <Skeleton className="mx-auto h-3 w-44" />
      </footer>
    </main>
  );
}
