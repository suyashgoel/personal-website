import type { EntryResponse, RecommendationItem } from '@personal-website/shared';
import { db } from '../clients';
import { EntryNotFoundError } from '../errors';
import { CACHE_KEYS, generateEmbedding, get, set, slugify } from '../utils';
import { getEntry } from './entries';

const NUM_RECOMMENDATIONS = 2;
const RECOMMENDATIONS_TTL = 15 * 60; // 15 minutes
const EMBEDDING_TTL = 60 * 60 * 24; // 24 hours

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

async function getOrGenerateEmbedding(query: string): Promise<number[]> {
  const normalizedQuery = normalizeQuery(query);
  const cacheKey = slugify(normalizedQuery);

  const cached = await get<number[]>(CACHE_KEYS.embedding(cacheKey));
  if (cached) {
    return cached;
  }

  const embedding = await generateEmbedding(normalizedQuery);
  await set(CACHE_KEYS.embedding(cacheKey), embedding, EMBEDDING_TTL);
  return embedding;
}

export async function getRecommendations(
  embedding: number[],
  k: number,
  excludeSlugs: string[] = []
): Promise<RecommendationItem[]> {
  const excludeCondition =
    excludeSlugs.length > 0
      ? db.$queryRaw<RecommendationItem[]>`
      SELECT
        slug,
        title,
        1 - (embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity
      FROM entries
      WHERE embedding IS NOT NULL
        AND slug != ALL(${excludeSlugs}::text[])
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector ASC
      LIMIT ${k}
    `
      : db.$queryRaw<RecommendationItem[]>`
      SELECT
        slug,
        title,
        1 - (embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity
      FROM entries
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector ASC
      LIMIT ${k}
    `;

  return excludeCondition;
}

export async function getRecommendationsBySlug(
  slug: string
): Promise<RecommendationItem[]> {
  const cached = await get<RecommendationItem[]>(
    CACHE_KEYS.recommendationsBySlug(slug)
  );
  if (cached) {
    return cached;
  }

  const embeddingResult = await db.$queryRaw<{ embedding: string }[]>`
    SELECT embedding::text as embedding
    FROM entries
    WHERE slug = ${slug}
  `;
  if (!embeddingResult[0] || !embeddingResult[0].embedding) {
    throw new EntryNotFoundError();
  }
  const embedding = JSON.parse(embeddingResult[0].embedding) as number[];
  const results = await getRecommendations(embedding, NUM_RECOMMENDATIONS + 1);

  const finalResults = results.slice(1);
  await set(
    CACHE_KEYS.recommendationsBySlug(slug),
    finalResults,
    RECOMMENDATIONS_TTL
  );
  return finalResults;
}

export async function getRecommendationsByQuery(
  query: string,
  excludeSlugs: string[] = []
): Promise<RecommendationItem[]> {
  const normalizedQuery = normalizeQuery(query);
  const cacheKey =
    excludeSlugs.length > 0
      ? `${slugify(normalizedQuery)}:exclude:${excludeSlugs.sort().join(',')}`
      : slugify(normalizedQuery);

  const cached = await get<RecommendationItem[]>(
    CACHE_KEYS.recommendationsByQuery(cacheKey)
  );
  if (cached) {
    return cached;
  }

  const embedding = await getOrGenerateEmbedding(query);
  const results = await getRecommendations(
    embedding,
    NUM_RECOMMENDATIONS,
    excludeSlugs
  );

  await set(
    CACHE_KEYS.recommendationsByQuery(cacheKey),
    results,
    RECOMMENDATIONS_TTL
  );
  return results;
}

export async function getTopMatchByQuery(
  query: string
): Promise<EntryResponse> {
  const normalizedQuery = normalizeQuery(query);
  const cacheKey = slugify(normalizedQuery);

  const cached = await get<EntryResponse>(CACHE_KEYS.topMatch(cacheKey));
  if (cached) {
    return cached;
  }

  const embedding = await getOrGenerateEmbedding(query);
  const recommendationItem = await getRecommendations(embedding, 1);
  const entry = await getEntry(recommendationItem[0].slug);

  await set(CACHE_KEYS.topMatch(cacheKey), entry, RECOMMENDATIONS_TTL);
  return entry;
}
