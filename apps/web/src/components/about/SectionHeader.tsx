import { SectionHeaderProps } from '@/lib/types/types';

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle ? (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
