import { buildApp } from './app';
import { db } from './clients/db';
import { redisClient } from './clients/redis';
import { env } from './config';

const app = buildApp();
let isShuttingDown = false;

app.listen({ port: env.PORT, host: '0.0.0.0' }).catch(err => {
  app.log.error(err);
  process.exit(1);
});

const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  app.log.info({ signal }, 'Shutting down server');

  const timeout = setTimeout(() => {
    app.log.error('Shutdown timeout, forcing exit');
    process.exit(1);
  }, 10000);

  try {
    await app.close();
    await redisClient.quit();
    await db.$disconnect();
    clearTimeout(timeout);
    app.log.info('Server shut down gracefully');
    process.exit(0);
  } catch (err) {
    clearTimeout(timeout);
    app.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
