import { env } from './env';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const cookieConfig = {
  path: '/', // Paths where cookie is sent
  cookieName: 'session', // Name of the cookie
  httpOnly: true, // Prevents the cookie from being accessed by JavaScript
  secure: env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
  sameSite: 'lax', // Prevents the cookie from being sent with cross-site requests
  signed: true, // Signs the cookie to prevent tampering
  maxAge: SEVEN_DAYS_MS, // 7 days
} as const;

export const clearCookieConfig = {
  ...cookieConfig,
  maxAge: 0,
} as const;
