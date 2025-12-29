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
      <p className="text-xs font-light text-primary tracking-wide">
        More like{' '}
        <span className="italic normal-case font-normal">{title}</span>
      </p>
      <nav>
        <ul className="flex flex-col gap-2">
          {recommendations.map(rec => (
            <li key={rec.slug}>
              <Link
                href={`/entries/${rec.slug}?query=${encodeURIComponent(query)}`}
                className="group flex items-center justify-between gap-3 text-primary transition-colors hover:text-muted-foreground"
              >
                <span className="text-sm sm:text-base truncate">
                  {rec.title}
                </span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function RecommendationsSection({
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
    <section className="mt-6 border-t border-border pt-6">
      <div className="flex flex-col sm:flex-row justify-end items-start">
        <div className="flex flex-col gap-2 sm:gap-4 w-full sm:w-auto sm:min-w-72">
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
