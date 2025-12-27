'use client';

import Link from 'next/link';

export function NavBar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background">
      <nav className="mx-auto flex h-14 max-w-3xl justify-center items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-light tracking-tight text-primary transition-colors hover:text-accent"
        >
          About
        </Link>
        <Link
          href="/search"
          className="text-lg font-light tracking-tight text-primary transition-colors hover:text-accent"
        >
          Search
        </Link>
      </nav>
    </header>
  );
}
