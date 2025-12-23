import { EntryPageView } from '@/components/entries/EntryPageView';
import { entriesApi } from '@/lib/api';
import type { EntryImage, EntryPageParams } from '@/lib/types';

export default async function EntryPage({ params }: EntryPageParams) {
  const { slug } = await params;

  const entry = await entriesApi.getBySlug(slug);
  const { title, body, imageContent } = entry;

  const image: EntryImage = {
    url: imageContent!.url,
    width: imageContent!.width,
    height: imageContent!.height,
  };

  return <EntryPageView slug={slug} title={title} body={body} image={image} />;
}
