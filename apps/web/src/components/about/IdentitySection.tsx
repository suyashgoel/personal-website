import { Badge } from '@/components/ui/badge';
import { IdentitySectionProps } from '@/lib/types/types';
import { SectionHeader } from './SectionHeader';

export function IdentitySection({ identity }: IdentitySectionProps) {
  return (
    <section className="space-y-4">
      <SectionHeader title="Identity" subtitle={identity.revelation} />
      <div className="flex flex-wrap gap-2">
        {identity.statements.map(s => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
    </section>
  );
}
