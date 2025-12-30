import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'error', 'warn', 'query']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export async function connectDatabase() {
  try {
    await db.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to database');
    throw err;
  }
}
