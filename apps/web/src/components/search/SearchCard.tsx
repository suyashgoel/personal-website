'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTopMatch } from '@/lib/query/recommendations';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SearchCard() {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: searchTopMatch, isPending } = useTopMatch();

  useEffect(() => {
    if (searchParams.get('redirected') === 'true') {
      setInfoMessage('Please search to access entries.');
      router.replace('/search', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (inputValue.trim()) {
      setInfoMessage(null);
      setErrorMessage(null);
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    searchTopMatch(trimmed, {
      onSuccess: ({ slug }) => {
        setErrorMessage(null);
        router.push(`/entries/${slug}?query=${encodeURIComponent(trimmed)}`);
      },
      onError: error => {
        console.error('[ERROR] Search top match failed', {
          error,
          query: trimmed,
          component: 'SearchCard',
          timestamp: new Date().toISOString(),
        });
        setErrorMessage('Search failed. Please try again.');
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
          <Search
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50"
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Ask anything..."
            className="h-12 pl-11 pr-4 text-base font-light border-border transition-colors placeholder:text-muted-foreground/50 w-full"
            value={inputValue}
            aria-label="Search"
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

      {infoMessage && (
        <p className="m-2 text-sm text-destructive">{infoMessage}</p>
      )}

      {errorMessage && (
        <p className="m-2 text-sm text-destructive">{errorMessage}</p>
      )}
    </>
  );
}
