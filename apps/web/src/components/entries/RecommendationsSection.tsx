'use client';

import { RecommendationsSkeleton } from '@/components/entries/RecommendationsSkeleton';
import {
  useRecommendationsByQuery,
  useRecommendationsBySlug,
} from '@/lib/query/recommendations';
import { searchQueryAtom } from '@/lib/state';
import {
  RecommendationListProps,
  RecommendationsSectionProps,
} from '@/lib/types/types';
import { useAtom } from 'jotai';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

function RecommendationList({
  title,
  recommendations,
}: RecommendationListProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        More like{' '}
        <span className="italic normal-case font-normal">{title}</span>
      </p>
      <nav>
        <ul className="flex flex-col gap-1.5">
          {recommendations.map(rec => (
            <li key={rec.slug}>
              <Link
                href={`/entries/${rec.slug}`}
                className="flex items-center justify-between gap-2 group py-1 px-1 -mx-1 rounded-sm transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="text-sm group-hover:underline truncate">
                  {rec.title}
                </span>
                <ArrowRight
                  className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function RecommendationsSection({
  slug,
  title,
}: RecommendationsSectionProps) {
  const [searchQuery] = useAtom(searchQueryAtom);

  const {
    data: entryRecommendations,
    isLoading: entryLoading,
    error: entryError,
  } = useRecommendationsBySlug(slug);
  const {
    data: queryRecommendations,
    isLoading: queryLoading,
    error: queryError,
  } = useRecommendationsByQuery(searchQuery, [slug]);

  useEffect(() => {
    if (entryError) {
      console.error('[ERROR] Failed to fetch entry recommendations', {
        error: entryError,
        slug,
      });
    }
  }, [entryError, slug]);

  useEffect(() => {
    if (queryError) {
      console.error('[ERROR] Failed to fetch query recommendations', {
        error: queryError,
        query: searchQuery,
      });
    }
  }, [queryError, searchQuery]);

  const hasEntryRecs = entryRecommendations && entryRecommendations.length > 0;
  const hasQueryRecs =
    searchQuery && queryRecommendations && queryRecommendations.length > 0;

  const isLoading = entryLoading || queryLoading;

  if (isLoading) {
    return <RecommendationsSkeleton />;
  }

  if (!hasEntryRecs && !hasQueryRecs) {
    return null;
  }

  return (
    <section className="mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-end items-start gap-6 md:gap-8">
        <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto md:min-w-72">
          {hasQueryRecs && (
            <RecommendationList
              title={searchQuery}
              recommendations={queryRecommendations}
            />
          )}

          {hasEntryRecs && (
            <RecommendationList
              title={title}
              recommendations={entryRecommendations}
            />
          )}
        </div>
      </div>
    </section>
  );
}
