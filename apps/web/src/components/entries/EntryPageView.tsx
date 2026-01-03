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
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 md:pt-20 md:pb-32 lg:px-8">
      <header className="mb-12">
        <h1 className="text-5xl font-light tracking-tight text-foreground leading-tight sm:text-6xl md:text-7xl">
          {title}
        </h1>
      </header>

      <div className="mb-12 overflow-hidden rounded-md border-hairline">
        <Image
          src={image.url}
          alt={title}
          className="w-full h-auto object-cover"
          width={image.width}
          height={image.height}
          loading="lazy"
        />
      </div>

      <p className="text-pretty text-lg font-light text-foreground/85 leading-relaxed sm:text-xl whitespace-pre-wrap">
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
