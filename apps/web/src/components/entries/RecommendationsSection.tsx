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
                href={`/entries/${rec.slug}?query=${encodeURIComponent(query)}`}
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
    <section className="mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-end items-start gap-6 md:gap-8">
        <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto md:min-w-72">
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
