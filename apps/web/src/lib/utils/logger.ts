import { envClient } from '@/lib/config/env.client';
import * as Sentry from '@sentry/nextjs';

const isDev = envClient.NODE_ENV === 'development';

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, context);
    }
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, context);
    }
  },

  error: (error: Error | unknown, context?: Record<string, unknown>) => {
    console.error('[ERROR]', error, context);

    if (!isDev) {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  },
};
