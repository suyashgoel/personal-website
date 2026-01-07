import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import type {
  FastifyBaseLogger,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify';
import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { logger, redisClient } from './clients';
import { env } from './config';
import aboutRoutes from './routes/about';
import authRoutes from './routes/auth';
import entriesRoutes from './routes/entries';
import recommendationsRoutes from './routes/recommendations';
import type { JWTPayload } from './types';

export function buildApp(opts: FastifyServerOptions = {}) {
  const app = Fastify({
    ...opts,
    loggerInstance: logger as FastifyBaseLogger,
    trustProxy: true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  app.register(multipart, {
    attachFieldsToBody: 'keyValues',
    limits: { fileSize: 1024 * 1024 * 25 }, // 25MB
  });

  app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'session',
      signed: true,
    },
    sign: {
      expiresIn: '7d',
    },
  });

  app.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
    keyGenerator: req => req.ip,
    redis: redisClient,
  });

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        logger.error({ err }, 'Error verifying JWT');
        reply.code(401).send({ error: 'Unauthorized' });
        return;
      }
    }
  );

  app.decorate(
    'authorize',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as JWTPayload;
      if (user.role !== 'admin') {
        logger.error({ userId: user.sub }, 'User is not authorized');
        reply.code(403).send({ error: 'Forbidden' });
        return;
      }
    }
  );

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(entriesRoutes, { prefix: '/entries' });
  app.register(recommendationsRoutes, { prefix: '/recommendations' });
  app.register(aboutRoutes, { prefix: '/about' });

  return app;
}
