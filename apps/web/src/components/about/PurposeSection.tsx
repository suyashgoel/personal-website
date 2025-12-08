import { AboutContent } from '@personal-website/shared';
import { SectionHeader } from './SectionHeader';

export function PurposeSection({
  purpose,
}: {
  purpose: AboutContent['purpose'];
}) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Purpose" />
      <p className="text-base text-muted-foreground leading-relaxed">
        {purpose.why}
      </p>
      <p className="text-base font-medium">{purpose.invitation}</p>
    </section>
  );
}
