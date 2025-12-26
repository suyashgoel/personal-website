import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8">
      <header className="mb-12">
        <Skeleton className="mb-3 h-9 w-56 sm:h-12 md:h-12" />
      </header>

      <article className="mb-12 space-y-6 leading-relaxed border-t border-border pt-12">
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '85%' }} />

        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '60%' }} />

        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '75%' }} />

        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '100%' }} />
        <Skeleton className="h-5 sm:h-6 md:h-7" style={{ width: '70%' }} />
      </article>

      <div className="mb-12 text-center">
        <Skeleton className="mx-auto h-5 w-40 sm:h-6" />
      </div>

      <section className="border-t border-border pt-12">
        <Skeleton className="mb-6 h-7 w-28 sm:h-8" />
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </section>

      <footer className="mt-12 border-t border-border pt-8">
        <Skeleton className="mx-auto h-4 w-44" />
      </footer>
    </main>
  );
}
