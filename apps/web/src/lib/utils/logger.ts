import * as Sentry from '@sentry/nextjs';

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, context || '');
    }
    Sentry.addBreadcrumb({
      message,
      level: 'info',
      data: context,
    });
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, context || '');
    }
    Sentry.captureMessage(message, {
      level: 'warning',
      extra: context,
    });
  },

  error: (error: Error | unknown, context?: Record<string, unknown>) => {
    if (isDev) {
      console.error(error, context);
    }
    Sentry.captureException(error, {
      extra: context,
    });
  },
};
