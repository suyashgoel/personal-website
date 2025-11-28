import { env } from './env';

export const cookieConfig = {
  path: '/', // Paths where cookie is sent
  cookieName: 'session', // Name of the cookie
  httpOnly: true, // Prevents the cookie from being accessed by JavaScript
  secure: env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
  sameSite: 'lax', // Prevents the cookie from being sent with cross-site requests
  signed: true, // Signs the cookie to prevent tampering
  maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
} as const;

export const clearCookieConfig = {
  path: cookieConfig.path,
  cookieName: cookieConfig.cookieName,
  httpOnly: cookieConfig.httpOnly,
  secure: cookieConfig.secure,
  sameSite: cookieConfig.sameSite,
  signed: cookieConfig.signed,
  maxAge: 0,
} as const;
