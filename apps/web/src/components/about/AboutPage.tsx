import type { AboutPageProps } from '@/lib/types';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function AboutPage({ content }: AboutPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8">
      <header className="mb-12">
        <h1 className="mb-3 text-4xl font-light tracking-tight text-primary sm:text-5xl md:text-5xl">
          Suyash Goel
        </h1>
      </header>

      <article className="mb-12 space-y-6 leading-relaxed border-t border-border pt-12">
        {content.body.split('\n\n').map((paragraph, index) => (
          <p
            key={index}
            className="text-pretty text-base font-light text-foreground/90 sm:text-lg md:text-xl"
          >
            {paragraph}
          </p>
        ))}
      </article>

      <div className="mb-12 text-center">
        <Link
          href="/search"
          className="inline-flex items-center text-base text-muted-foreground transition-colors hover:text-accent sm:text-lg"
        >
          Explore the archives
        </Link>
      </div>

      <section className="border-t border-border pt-12">
        <h2 className="mb-6 text-2xl font-light tracking-tight text-primary sm:text-3xl">
          Connect
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href={`mailto:${content.contact.email}`}
            className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent"
          >
            <Mail className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="text-sm sm:text-base">Email</span>
          </Link>
          <Link
            href={content.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent"
          >
            <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="text-sm sm:text-base">GitHub</span>
          </Link>
          <Link
            href={content.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent"
          >
            <Linkedin className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="text-sm sm:text-base">LinkedIn</span>
          </Link>
        </div>
      </section>

      <footer className="mt-12 border-t border-border pt-8">
        <p className="text-center text-sm text-muted-foreground">
          © 2025 Suyash Goel
        </p>
      </footer>
    </main>
  );
}
