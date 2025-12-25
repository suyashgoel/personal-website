import { redisClient } from '../clients/redis';

const CACHE_PREFIX = 'cache:';

function getCacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

export async function get<T>(key: string): Promise<T | null> {
  try {
    const cacheKey = getCacheKey(key);
    const value = await redisClient.get(cacheKey);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    return null;
  }
}

export async function set<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  try {
    const cacheKey = getCacheKey(key);
    const serialized = JSON.stringify(value);
    await redisClient.setex(cacheKey, ttlSeconds, serialized);
  } catch {
    // Ignore error
  }
}

export async function del(key: string): Promise<void> {
  try {
    const cacheKey = getCacheKey(key);
    await redisClient.del(cacheKey);
  } catch {
    // Ignore error
  }
}

export async function delPattern(pattern: string): Promise<void> {
  try {
    const fullPattern = getCacheKey(pattern);
    const stream = redisClient.scanStream({
      match: fullPattern,
      count: 100,
    });

    const keys: string[] = [];

    for await (const batch of stream) {
      keys.push(...batch);
    }

    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch {
    // Ignore error
  }
}

export const CACHE_KEYS = {
  entries: 'entries',
  entry: (slug: string) => `entry:${slug}`,
  about: 'about',
  recommendationsBySlug: (slug: string) => `recommendations:slug:${slug}`,
  recommendationsByQuery: (query: string) => `recommendations:query:${query}`,
  topMatch: (query: string) => `top-match:${query}`,
  embedding: (query: string) => `embedding:${query}`,
} as const;
