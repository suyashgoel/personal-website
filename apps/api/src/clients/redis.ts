import { Redis } from 'ioredis';
import { env } from '../config';
import { logger } from './logger';

export const redisClient = new Redis(env.REDIS_URL, {
  connectionName: 'personal-website',
  connectTimeout: 1000,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redisClient.on('error', err => {
  logger.error({ err }, 'Redis connection error');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis reconnecting');
});

redisClient.on('ready', () => {
  logger.info('Redis ready');
});
