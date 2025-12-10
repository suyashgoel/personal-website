import type {
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

export interface RecommendationsSectionProps {
  slug: EntryResponse['slug'];
  title: EntryResponse['title'];
}

export interface RecommendationListProps {
  title: string;
  recommendations: RecommendationsResponse;
}
