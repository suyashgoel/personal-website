import { AboutContent } from '@personal-website/shared';
import { SectionHeader } from './SectionHeader';

export function ContactSection({
  contact,
}: {
  contact: AboutContent['contact'];
}) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Contact" subtitle={contact.closing} />
      <div className="space-y-2 text-sm">
        <a
          href={`mailto:${contact.email}`}
          className="text-primary hover:underline"
        >
          {contact.email}
        </a>
        <div className="flex gap-4 text-muted-foreground">
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
          <a
            href={contact.x}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            X
          </a>
        </div>
      </div>
    </section>
  );
}
