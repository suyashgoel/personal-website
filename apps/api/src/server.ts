import { buildApp } from './app';
import { connectDatabase, db, redisClient } from './clients';
import { env } from './config';

const app = buildApp();
let isShuttingDown = false;

async function start() {
  const port = env.PORT;

  try {
    await app.listen({
      port,
      host: '0.0.0.0',
    });

    app.log.info(`API listening on ${port}`);

    connectDatabase().catch(err => {
      app.log.error(err, 'Database connection failed');
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

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
