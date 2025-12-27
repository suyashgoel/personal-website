import {
  RecommendationListProps,
  RecommendationsSectionProps,
} from '@/lib/types/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

function RecommendationList({
  title,
  recommendations,
  query,
}: RecommendationListProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-light text-muted-foreground uppercase tracking-wide">
        More like{' '}
        <span className="italic normal-case font-normal">{title}</span>
      </p>
      <nav>
        <ul className="flex flex-col gap-2">
          {recommendations.map(rec => (
            <li key={rec.slug}>
              <Link
                href={`/entries/${rec.slug}?query=${encodeURIComponent(query)}`}
                className="group flex items-center justify-between gap-3 text-muted-foreground transition-colors hover:text-accent"
              >
                <span className="text-sm sm:text-base group-hover:underline truncate">
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
  query,
  queryRecommendations,
  entryRecommendations,
}: RecommendationsSectionProps) {
  const hasEntryRecs = entryRecommendations && entryRecommendations.length > 0;
  const hasQueryRecs =
    query && queryRecommendations && queryRecommendations.length > 0;

  if (!hasEntryRecs && !hasQueryRecs) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-border pt-12">
      <div className="flex flex-col sm:flex-row justify-end items-start gap-6 sm:gap-8">
        <div className="flex flex-col gap-6 sm:gap-8 w-full sm:w-auto sm:min-w-72">
          {hasQueryRecs && (
            <RecommendationList
              title={query}
              recommendations={queryRecommendations}
              query={query}
            />
          )}

          {hasEntryRecs && (
            <RecommendationList
              title={title}
              recommendations={entryRecommendations}
              query={query}
            />
          )}
        </div>
      </div>
    </section>
  );
}
