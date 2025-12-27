import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function EntryPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-10 space-y-6">
      <Card className="shadow-none border-0 p-0">
        <CardHeader className="p-0 pb-2">
          <Skeleton className="h-8 w-3/4 sm:h-9" />
        </CardHeader>
      </Card>

      <Card className="overflow-hidden shadow-none border-0">
        <CardContent className="p-0">
          <Skeleton className="w-full aspect-video" />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-9/12" />
      </section>

      <Separator />

      <section className="mt-12 pt-8">
        <div className="flex flex-col md:flex-row justify-end items-start gap-6 md:gap-8">
          <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto md:min-w-72">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-11/12" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-10/12" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
