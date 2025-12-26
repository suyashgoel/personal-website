import { ApiError } from '@/lib/api/client';
import type {
  AboutContent,
  EntryResponse,
  ImageContent,
  RecommendationsResponse,
} from '@personal-website/shared';

export type EntryImage = Pick<ImageContent, 'url' | 'width' | 'height'>;

export interface EntryPageProps {
  slug: EntryResponse['slug'];
  title: EntryResponse['title'];
  body: EntryResponse['body'];
  image: EntryImage;
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
