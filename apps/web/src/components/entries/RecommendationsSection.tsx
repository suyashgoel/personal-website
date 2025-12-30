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
    <div className="space-y-3">
      <p className="text-xs font-light text-foreground/50 tracking-tight">
        More like{' '}
        <span className="italic normal-case font-normal">{title}</span>
      </p>
      <nav>
        <ul className="flex flex-col gap-2.5">
          {recommendations.map(rec => (
            <li key={rec.slug}>
              <Link
                href={`/entries/${rec.slug}?query=${encodeURIComponent(query)}`}
                className="group flex items-center justify-between gap-3 text-foreground/70 transition-all duration-200 hover:text-foreground"
              >
                <span className="text-sm font-light tracking-tight truncate">
                  {rec.title}
                </span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
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
    <section className="mt-12 pt-10 border-t">
      <div className="flex flex-col sm:flex-row justify-end items-start">
        <div className="flex flex-col gap-8 w-full sm:w-auto sm:min-w-72">
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
