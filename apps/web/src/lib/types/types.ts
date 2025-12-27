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
  query: string;
  queryRecommendations: RecommendationsResponse;
  entryRecommendations: RecommendationsResponse;
}

export interface EntryPageParams {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ query?: string }>;
}

export interface RecommendationsSectionProps {
  slug: EntryResponse['slug'];
  title: EntryResponse['title'];
  query: string;
  queryRecommendations: RecommendationsResponse;
  entryRecommendations: RecommendationsResponse;
}

export interface RecommendationListProps {
  title: string;
  recommendations: RecommendationsResponse;
  query: string;
}

export interface ErrorMessageProps {
  error: Error | ApiError | unknown;
}

export interface AboutPageProps {
  content: AboutContent;
}
