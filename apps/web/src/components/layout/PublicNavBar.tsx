'use client';

import Link from 'next/link';

export function PublicNavBar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-hairline bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-3xl justify-center items-center gap-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-light tracking-tight text-foreground/70 transition-all duration-200 hover:text-foreground hover:tracking-normal"
        >
          About
        </Link>
        <Link
          href="/search"
          className="text-sm font-light tracking-tight text-foreground/70 transition-all duration-200 hover:text-foreground hover:tracking-normal"
        >
          Search
        </Link>
      </nav>
    </header>
  );
}
