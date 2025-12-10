import type {
  EntryResponse,
  ImageContent,
  LinkContent,
} from '@personal-website/shared';

export type EntryImage = Pick<ImageContent, 'url' | 'width' | 'height'>;
export type EntryLink = Pick<LinkContent, 'url'>;

export interface EntryPageProps {
  title: EntryResponse['title'];
  body: EntryResponse['body'];
  image?: EntryImage;
  link?: EntryLink;
}
