import { EntryPageView } from '@/components/entries/EntryPageView';
import { entriesApi, recommendationsApi } from '@/lib/api';
import { ApiError } from '@/lib/api/client';
import type { EntryImage, EntryPageParams } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EntryPage({
  params,
  searchParams,
}: EntryPageParams) {
  const { slug } = await params;
  const { query } = await searchParams;

  if (!query) {
    redirect('/search?redirected=true');
  }

  try {
    const entry = await entriesApi.getBySlug(slug);
    const { title, body, imageContent } = entry;

    if (!imageContent) {
      throw new Error('Entry image is missing');
    }

    const [queryRecommendations, entryRecommendations] = await Promise.all([
      recommendationsApi.getByQuery(query, [slug]).catch(error => {
        console.error('[ERROR] Failed to fetch query recommendations', {
          error,
          component: 'EntryPage',
          slug,
          query,
          timestamp: new Date().toISOString(),
        });
        return [];
      }),
      recommendationsApi.getBySlug(slug).catch(error => {
        console.error('[ERROR] Failed to fetch entry recommendations', {
          error,
          component: 'EntryPage',
          slug,
          timestamp: new Date().toISOString(),
        });
        return [];
      }),
    ]);

    const image: EntryImage = {
      url: imageContent.url,
      width: imageContent.width,
      height: imageContent.height,
    };

    return (
      <EntryPageView
        slug={slug}
        title={title}
        body={body}
        image={image}
        query={query}
        queryRecommendations={queryRecommendations}
        entryRecommendations={entryRecommendations}
      />
    );
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }

    throw error;
  }
}
