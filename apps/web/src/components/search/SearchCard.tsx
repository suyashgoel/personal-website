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
      <header className="mb-16">
        <h1 className="mb-4 text-6xl font-light tracking-tight text-foreground leading-tight sm:text-7xl md:text-8xl">
          Explore
        </h1>
        <p className="text-lg font-light text-foreground/60">
          Start with a word.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
          <Input
            type="text"
            placeholder="Ask anything..."
            className="h-14 pl-11 pr-4 text-lg font-light border-hairline transition-all duration-200 placeholder:text-foreground/40 w-full focus:border-foreground/30"
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
          className="w-full h-12 text-sm font-light tracking-tight text-foreground border-hairline rounded-md transition-all duration-200 hover:bg-accent hover:border-foreground/30"
        >
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {infoMessage && (
        <p className="mt-6 text-sm font-light text-destructive">
          {infoMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mt-6 text-sm font-light text-destructive">
          {errorMessage}
        </p>
      )}
    </>
  );
}
