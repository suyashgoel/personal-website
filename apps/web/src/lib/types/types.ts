import { ApiError } from '@/lib/api/client';
import type {
  AboutContent,
  EntryResponse,
  ImageContent,
  LinkContent,
  RecommendationsResponse,
} from '@personal-website/shared';

export type EntryImage = Pick<ImageContent, 'url' | 'width' | 'height'>;
export type EntryLink = Pick<LinkContent, 'url'>;

export interface EntryPageProps {
  slug: EntryResponse['slug'];
  title: EntryResponse['title'];
  body: EntryResponse['body'];
  image?: EntryImage;
  link?: EntryLink;
}

export interface EntryPageParams {
  params: Promise<{ slug: string }>;
}

export interface RecommendationsSectionProps {
  slug: EntryResponse['slug'];
  title: EntryResponse['title'];
}

export interface RecommendationListProps {
  title: string;
  recommendations: RecommendationsResponse;
}

export interface ErrorMessageProps {
  error: Error | ApiError | unknown;
}

// About page component props
export interface AboutPageProps {
  content: AboutContent;
}

export interface HeroSectionProps {
  hero: AboutContent['hero'];
}

export interface JourneySectionProps {
  journey: AboutContent['journey'];
}

export interface IdentitySectionProps {
  identity: AboutContent['identity'];
}

export interface LovesSectionProps {
  loves: AboutContent['loves'];
}

export interface PurposeSectionProps {
  purpose: AboutContent['purpose'];
}

export interface ContactSectionProps {
  contact: AboutContent['contact'];
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}
