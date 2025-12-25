import { Redis } from 'ioredis';
import { env } from '../config/env';

export const redisClient = new Redis(env.REDIS_URL, {
  connectionName: 'personal-website',
  connectTimeout: 1000,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});
