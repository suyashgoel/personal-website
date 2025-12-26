'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTopMatch } from '@/lib/query/recommendations';
import { searchQueryAtom } from '@/lib/state';
import { useAtom } from 'jotai';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchCard() {
  const [_, setSearchQuery] = useAtom(searchQueryAtom);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const { mutate: searchTopMatch, isPending } = useTopMatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setSearchQuery(trimmed);

    searchTopMatch(trimmed, {
      onSuccess: ({ slug }) => {
        router.push(`/entries/${slug}`);
      },
      onError: error => {
        console.error('[ERROR] Search top match failed', {
          error,
          query: trimmed,
        });
      },
    });
  };

  return (
    <>
      <header className="mb-10">
        <h1 className="mb-2 text-4xl font-light tracking-tight text-primary sm:text-5xl md:text-6xl">
          Explore
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Search to explore my world
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            type="text"
            placeholder="Ask anything..."
            className="h-12 pl-11 pr-4 text-base font-light border-border transition-colors placeholder:text-muted-foreground/50 w-full"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isPending}
            autoFocus
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          disabled={isPending || !inputValue.trim()}
          className="w-full py-2.5 text-sm font-light tracking-tight text-primary border-border rounded-lg transition-all hover:bg-accent"
        >
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </form>
    </>
  );
}
