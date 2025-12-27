import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { EntryPageProps } from '@/lib/types';
import Image from 'next/image';
import { RecommendationsSection } from './RecommendationsSection';

export function EntryPageView({
  slug,
  title,
  body,
  image,
  query,
  queryRecommendations,
  entryRecommendations,
}: EntryPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-6">
      <Card className="shadow-none border-0 p-0">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Image
            src={image.url}
            alt={title}
            className="w-full h-auto object-cover"
            width={image.width}
            height={image.height}
            loading="lazy"
          />
        </CardContent>
      </Card>

      <section className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {body}
      </section>

      <Separator />

      <RecommendationsSection
        slug={slug}
        title={title}
        query={query}
        queryRecommendations={queryRecommendations}
        entryRecommendations={entryRecommendations}
      />
    </main>
  );
}
