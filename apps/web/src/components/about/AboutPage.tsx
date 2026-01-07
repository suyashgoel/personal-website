import type { AboutPageProps } from '@/lib/types';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function AboutPage({ content }: AboutPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 md:pt-20 md:pb-32 lg:px-8">
      <header className="mb-20">
        <h1 className="text-6xl font-light tracking-tight text-foreground leading-tight sm:text-7xl">
          Suyash Goel
        </h1>
      </header>

      <article className="mb-20 space-y-8 leading-relaxed">
        {content.body.split('\n\n').map((paragraph, index) => (
          <p
            key={index}
            className="text-pretty text-lg font-light text-foreground/85 leading-relaxed sm:text-xl"
          >
            {paragraph}
          </p>
        ))}
      </article>

      <div className="mb-20 text-center">
        <Link
          href="/search"
          className="inline-flex items-center text-lg font-light tracking-tight text-foreground/60 transition-all duration-200 hover:text-foreground hover:tracking-normal"
        >
          Explore the archives
        </Link>
      </div>

      <section className="pt-4">
        <h2 className="mb-10 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          Connect
        </h2>
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <Link
            href={`mailto:${content.contact.email}`}
            className="group flex items-center gap-3 text-foreground/60 transition-all duration-200 hover:text-foreground"
          >
            <Mail className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-light tracking-tight">Email</span>
          </Link>
          <Link
            href={content.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-foreground/60 transition-all duration-200 hover:text-foreground"
          >
            <Github className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-light tracking-tight">GitHub</span>
          </Link>
          <Link
            href={content.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-foreground/60 transition-all duration-200 hover:text-foreground"
          >
            <Linkedin className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-light tracking-tight">LinkedIn</span>
          </Link>
        </div>
      </section>

      <footer className="mt-12 pt-12">
        <p className="text-center text-xs font-light tracking-tight text-foreground/50">
          © 2025 Suyash Goel
        </p>
      </footer>
    </div>
  );
}
