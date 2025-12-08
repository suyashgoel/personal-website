import { Badge } from '@/components/ui/badge';
import { AboutContent } from '@personal-website/shared';
import { SectionHeader } from './SectionHeader';

export function IdentitySection({
  identity,
}: {
  identity: AboutContent['identity'];
}) {
  console.log(identity.revelation);
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
