import { EntryResponse, RecommendationItem } from '@personal-website/shared';
import { db } from '../clients';
import { EntryNotFoundError } from '../errors';
import { generateEmbedding } from '../utils';
import { getEntry } from './entries';

const NUM_RECOMMENDATIONS = 2;

export async function getRecommendations(
  embedding: number[],
  k: number
): Promise<RecommendationItem[]> {
  const recommendationItems = await db.$queryRaw<RecommendationItem[]>`
      SELECT
        slug,
        title,
        1 - (embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity
      FROM entries
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector ASC
      LIMIT ${k}
    `;
  return recommendationItems;
}

export async function getRecommendationsBySlug(
  slug: string
): Promise<RecommendationItem[]> {
  const embeddingResult = await db.$queryRaw<{ embedding: string }[]>`
    SELECT
      embedding::text as embedding
    FROM entries
    WHERE slug = ${slug}
  `;
  if (!embeddingResult[0] || !embeddingResult[0].embedding) {
    throw new EntryNotFoundError();
  }
  const embedding = JSON.parse(embeddingResult[0].embedding) as number[];
  const results = await getRecommendations(embedding, NUM_RECOMMENDATIONS + 1);
  return results.slice(1);
}

export async function getRecommendationsByQuery(
  query: string
): Promise<RecommendationItem[]> {
  const embedding = await generateEmbedding(query);
  const results = await getRecommendations(embedding, NUM_RECOMMENDATIONS);
  return results;
}

export async function getTopMatchByQuery(
  query: string
): Promise<EntryResponse> {
  const embedding = await generateEmbedding(query);
  const recommendationItem = await getRecommendations(embedding, 1);
  const entry = await getEntry(recommendationItem[0].slug);
  return entry;
}
