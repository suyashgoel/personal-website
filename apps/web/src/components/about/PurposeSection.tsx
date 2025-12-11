import { PurposeSectionProps } from '@/lib/types/types';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';

export function PurposeSection({ purpose }: PurposeSectionProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Purpose" />
      <p className="text-base text-muted-foreground leading-relaxed">
        {purpose.why}
      </p>
      <Link href="/search">
        <p className="text-base font-medium">{purpose.invitation}</p>
      </Link>
    </section>
  );
}
