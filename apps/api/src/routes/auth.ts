import {
  LoginRequest,
  loginRequestSchema,
  RegisterRequest,
  registerRequestSchema,
  userResponseSchema,
} from '@personal-website/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { clearCookieConfig, cookieConfig } from '../config';
import { UserError } from '../errors';
import { getCurrentUser, login, register } from '../services/auth';
import { JWTPayload } from '../types';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
      config: {
        rateLimit: { max: 5, timeWindow: '10 minutes' },
      },
      schema: {
        body: registerRequestSchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await register(request.body as RegisterRequest);
        reply.setCookie(
          cookieConfig.cookieName,
          await reply.jwtSign({ sub: user.id, role: user.role } as JWTPayload),
          cookieConfig
        );
        request.log.info({ userId: user.id }, 'User registered');
        return reply.code(201).send(user);
      } catch (err) {
        if (err instanceof UserError) {
          request.log.warn(err);
          return reply.code(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.post(
    '/login',
    {
      config: {
        rateLimit: { max: 5, timeWindow: '1 minute' },
      },
      schema: {
        body: loginRequestSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await login(request.body as LoginRequest);
        reply.setCookie(
          cookieConfig.cookieName,
          await reply.jwtSign({ sub: user.id, role: user.role } as JWTPayload),
          cookieConfig
        );
        request.log.info({ userId: user.id }, 'User logged in');
        return reply.code(200).send(user);
      } catch (err) {
        if (err instanceof UserError) {
          request.log.warn({ err, ip: request.ip });
          return reply.code(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.post(
    '/logout',
    {
      preHandler: fastify.authenticate,
      config: {
        rateLimit: false,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as JWTPayload;
      reply.setCookie(clearCookieConfig.cookieName, '', clearCookieConfig);
      request.log.info({ userId: user.sub }, 'User logged out');
      return reply.code(204).send();
    }
  );

  fastify.get(
    '/me',
    {
      preHandler: fastify.authenticate,
      config: {
        rateLimit: false,
      },
      schema: {
        response: {
          200: userResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as JWTPayload;
      const userId = user.sub;
      try {
        const currentUser = await getCurrentUser(userId);
        request.log.info({ userId: currentUser.id }, 'User fetched');
        return reply.send(currentUser);
      } catch (err) {
        if (err instanceof UserError) {
          request.log.warn(err);
          return reply.code(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}
