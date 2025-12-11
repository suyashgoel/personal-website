import { EntryPageView } from '@/components/entries/EntryPageView';
import { entriesApi } from '@/lib/api';
import type { EntryImage, EntryLink, EntryPageParams } from '@/lib/types';

export default async function EntryPage({ params }: EntryPageParams) {
  const { slug } = await params;

  const entry = await entriesApi.getBySlug(slug);
  const { title, body, type, imageContent, linkContent } = entry;

  const image: EntryImage | undefined =
    type === 'image' && imageContent
      ? {
          url: imageContent.url,
          width: imageContent.width,
          height: imageContent.height,
        }
      : undefined;

  const link: EntryLink | undefined =
    type === 'link' && linkContent ? { url: linkContent.url } : undefined;

  return (
    <EntryPageView
      slug={slug}
      title={title}
      body={body}
      image={image}
      link={link}
    />
  );
}
