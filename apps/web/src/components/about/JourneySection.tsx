import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { JourneySectionProps } from '@/lib/types/types';
import { SectionHeader } from './SectionHeader';

export function JourneySection({ journey }: JourneySectionProps) {
  const sorted = [...journey].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <section className="space-y-4">
      <SectionHeader title="Journey" />
      <div className="space-y-4">
        {sorted.map(item => (
          <Card
            key={`${item.company}-${item.period}`}
            className="p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.role}</p>
                <p className="text-sm text-muted-foreground">{item.company}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {item.period}
              </span>
            </div>
            <Separator />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
