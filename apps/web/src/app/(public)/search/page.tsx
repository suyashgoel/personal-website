import { SearchCard } from '@/components/search/SearchCard';

export default function SearchPage() {
  return (
    <main className="w-full mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8 flex-1 flex flex-col items-center justify-center">
      <div className="w-full">
        <SearchCard />
      </div>
    </main>
  );
}
