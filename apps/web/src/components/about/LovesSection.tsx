import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
export function LovesSection({ loves }: { loves: string[] }) {
  return (
    <section className="space-y-4">
      <SectionHeader title="Things I love" />
      <div className="flex flex-wrap gap-2">
        {loves.map(love => (
          <Badge key={love} variant="secondary">
            {love}
          </Badge>
        ))}
      </div>
    </section>
  );
}
