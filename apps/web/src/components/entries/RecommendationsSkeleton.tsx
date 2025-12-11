import { Skeleton } from '@/components/ui/skeleton';

export function RecommendationsSkeleton() {
  return (
    <div className="mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
        <div className="flex-1 w-full md:w-auto">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-72">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}
