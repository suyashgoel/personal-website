import { env } from './env';

export const cookieConfig = {
  cookieName: 'session',
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  signed: true,
  maxAge: 60 * 60 * 24 * 7 * 1000,
} as const;

export const clearCookieConfig = {
  httpOnly: cookieConfig.httpOnly,
  secure: cookieConfig.secure,
  sameSite: cookieConfig.sameSite,
} as const;
