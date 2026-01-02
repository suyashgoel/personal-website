import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const db = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['info', 'error', 'warn', 'query']
      : ['error'],
});

export async function connectDatabase() {
  try {
    await db.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to database');
    throw err;
  }
}
