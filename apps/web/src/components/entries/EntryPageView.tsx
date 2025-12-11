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
  link,
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

      {image && (
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
      )}

      {link && (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline break-all text-sm"
        >
          {link.url}
        </a>
      )}

      <section className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {body}
      </section>

      <Separator />

      <RecommendationsSection slug={slug} title={title} />
    </main>
  );
}
