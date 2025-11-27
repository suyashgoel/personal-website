import { env } from './env';

export const cookieConfig = {
  path: '/',
  cookieName: 'session',
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  signed: true,
  maxAge: 60 * 60 * 24 * 7 * 1000,
} as const;

export const clearCookieConfig = {
  path: cookieConfig.path,
  httpOnly: cookieConfig.httpOnly,
  secure: cookieConfig.secure,
  sameSite: cookieConfig.sameSite,
  signed: cookieConfig.signed,
} as const;
