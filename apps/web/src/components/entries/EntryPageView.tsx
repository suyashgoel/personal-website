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
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8">
      <header className="mb-6">
        <h1 className="mb-3 text-4xl font-light tracking-tight text-primary sm:text-5xl md:text-5xl">
          {title}
        </h1>
      </header>

      <div className="mb-6 overflow-hidden">
        <Image
          src={image.url}
          alt={title}
          className="w-full h-auto object-cover rounded-lg"
          width={image.width}
          height={image.height}
          loading="lazy"
        />
      </div>

      <p className="text-pretty text-base font-light text-foreground/90 sm:text-lg md:text-xl whitespace-pre-wrap">
        {body}
      </p>

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
