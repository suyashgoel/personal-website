import { AboutPageProps } from '@/lib/types/types';
import { ContactSection } from './ContactSection';
import { HeroSection } from './HeroSection';
import { IdentitySection } from './IdentitySection';
import { JourneySection } from './JourneySection';
import { LovesSection } from './LovesSection';
import { PurposeSection } from './PurposeSection';

export function AboutPage({ content }: AboutPageProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-12">
      <HeroSection hero={content.hero} />
      <JourneySection journey={content.journey} />
      <IdentitySection identity={content.identity} />
      <LovesSection loves={content.loves} />
      <PurposeSection purpose={content.purpose} />
      <ContactSection contact={content.contact} />
    </main>
  );
}
