'use client';

import { EntryCard } from '@/components/admin/EntryCard';
import { useEntries } from '@/lib/query/entries';
import { AdminLoader } from './AdminLoader';

export function EntryCardList() {
  const { data: entries, isLoading, isError, error } = useEntries();

  if (isLoading) {
    return <AdminLoader />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive font-light">
          Failed to load entries. Please try again.
        </p>
        {error instanceof Error && (
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        )}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground font-light">No entries found.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-light tracking-tight text-foreground mb-8">
        Entries
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {entries.map((entry, index) => (
          <EntryCard key={entry.id} entry={entry} isAboveFold={index < 4} />
        ))}
      </div>
    </>
  );
}
