import {
  LoginRequest,
  loginRequestSchema,
  RegisterRequest,
  registerRequestSchema,
  userResponseSchema,
} from '@personal-website/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { clearCookieConfig, cookieConfig } from '../lib/cookie';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../lib/errors';
import { getCurrentUser, login, register } from '../services/auth';
import { JWTPayload } from '../types/fastify';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
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
          'session',
          await reply.jwtSign({ sub: user.id, role: user.role } as JWTPayload),
          cookieConfig
        );
        request.log.info({ userId: user.id }, 'User registered');
        return reply.code(201).send(user);
      } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
          return reply.code(409).send({ error: err.message });
        }
        request.log.error(err);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.post(
    '/login',
    {
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
          'session',
          await reply.jwtSign({ sub: user.id, role: user.role } as JWTPayload),
          cookieConfig
        );
        request.log.info({ userId: user.id }, 'User logged in');
        return reply.code(200).send(user);
      } catch (err) {
        if (err instanceof InvalidCredentialsError) {
          return reply.code(401).send({ error: err.message });
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
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as JWTPayload;
      reply.setCookie(clearCookieConfig.cookieName, '', clearCookieConfig);
      request.log.info({ userId: user.sub }, 'User logged out');
      return reply.code(200).send({ ok: true });
    }
  );

  fastify.get(
    '/me',
    {
      preHandler: fastify.authenticate,
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
        if (err instanceof UserNotFoundError) {
          return reply.code(404).send({ error: err.message });
        }
        request.log.error(err);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}
