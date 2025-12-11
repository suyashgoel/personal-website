'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAbout } from '@/lib/query/about';
import { useTopMatch } from '@/lib/query/recommendations';
import { searchQueryAtom } from '@/lib/state';
import { logger } from '@/lib/utils/logger';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function SearchCard() {
  const { data: about, isLoading: isLoadingAbout } = useAbout();
  const [_, setSearchQuery] = useAtom(searchQueryAtom);
  const [inputValue, setInputValue] = useState('');
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const placeholders = useMemo(() => {
    return (about?.loves ?? []).map(
      love => love.charAt(0).toUpperCase() + love.slice(1)
    );
  }, [about]);

  const { mutate: searchTopMatch, isPending } = useTopMatch();

  useEffect(() => {
    if (placeholders.length === 0) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

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
        logger.error('Search failed', {
          error,
          query: trimmed,
        });
      },
    });
  };

  const placeholder =
    isLoadingAbout || placeholders.length === 0
      ? 'Search...'
      : placeholders[index];

  return (
    <form
      className="w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] max-w-2xl"
      onSubmit={handleSubmit}
    >
      <Card className="max-w-2xl py-10 px-4 sm:px-6">
        <CardHeader>
          <CardTitle>Explore</CardTitle>
          <CardDescription>Search to learn more about me!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder={placeholder}
            className="h-12 text-base"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isPending}
          />
          <div className="flex justify-center">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
