import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminLoader() {
  return (
    <>
      <Skeleton className="h-9 w-32 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-hairline">
            <Skeleton className="aspect-video w-full" />
          </Card>
        ))}
      </div>
    </>
  );
}
