import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify, {
  FastifyBaseLogger,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { logger } from './clients/logger';
import { cookieConfig } from './config/cookie';
import { env } from './config/env';
import authRoutes from './routes/auth';

export function buildApp(opts: FastifyServerOptions = {}) {
  const app = Fastify({
    ...opts,
    loggerInstance: logger as FastifyBaseLogger,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(cors, {
    origin: env.NODE_ENV === 'production' ? false : true,
    credentials: true,
  });

  app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: cookieConfig,
    sign: {
      expiresIn: '7d',
    },
  });

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
      }
    }
  );

  app.get('/health', async () => {
    return { status: 'ok', brain: 'active' };
  });

  app.register(authRoutes, { prefix: '/auth' });

  return app;
}
