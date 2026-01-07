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
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8 md:pt-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-light tracking-tight leading-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h1>
      </header>

      <div className="mb-6 overflow-hidden rounded-xl border-hairline aspect-[4/3]">
        <Image
          src={image.url}
          alt={title}
          className="w-full h-full object-cover"
          width={image.width}
          height={image.height}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <p className="text-pretty text-lg font-light text-foreground/85 leading-snug sm:text-xl whitespace-pre-wrap">
        {body}
      </p>

      <RecommendationsSection
        slug={slug}
        title={title}
        query={query}
        queryRecommendations={queryRecommendations}
        entryRecommendations={entryRecommendations}
      />
    </div>
  );
}
