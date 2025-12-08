import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  SENTRY_ORG: z.string().min(1),
  SENTRY_PROJECT: z.string().min(1),
});

const parsed = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
});

if (!parsed.success) {
  console.error('Invalid server env', parsed.error.format());
  throw new Error('Invalid server env');
}

export const envServer = parsed.data;
