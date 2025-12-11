import { HeroSectionProps } from '@/lib/types/types';

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="space-y-4">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        About
      </p>
      <h1 className="text-4xl font-semibold">{hero.name}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed">
        {hero.introduction}
      </p>
    </section>
  );
}
