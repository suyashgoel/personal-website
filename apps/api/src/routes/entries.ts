import {
  CreateEntry,
  createEntrySchema,
  entriesResponseSchema,
  EntryParams,
  entryParamsSchema,
  entryResponseSchema,
  nullResponseSchema,
  UpdateEntry,
  updateEntrySchema,
} from '@personal-website/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServiceError, UserError } from '../errors';
import {
  createEntry,
  deleteEntry,
  getEntries,
  getEntry,
  updateEntry,
} from '../services/entries';

export default async function entriesRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate, fastify.authorize],
      config: {
        rateLimit: false,
      },
      schema: {
        body: createEntrySchema,
        response: {
          201: entryResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const entry = await createEntry(request.body as CreateEntry);
        request.log.info({ slug: entry.slug }, 'Entry created');
        return reply.status(201).send(entry);
      } catch (err) {
        if (err instanceof UserError) {
          request.log.warn(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        if (err instanceof ServiceError) {
          request.log.error(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: entriesResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const entries = await getEntries();
        request.log.info({ numEntries: entries.length }, 'Entries fetched');
        return reply.code(200).send(entries);
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.get(
    '/:slug',
    {
      schema: {
        params: entryParamsSchema,
        response: {
          200: entryResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { slug } = request.params as EntryParams;
        const entry = await getEntry(slug);
        request.log.info({ slug }, 'Entry fetched');
        return reply.code(200).send(entry);
      } catch (err) {
        if (err instanceof UserError) {
          request.log.warn(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.delete(
    '/:slug',
    {
      preHandler: [fastify.authenticate, fastify.authorize],
      config: {
        rateLimit: false,
      },
      schema: {
        params: entryParamsSchema,
        response: { 204: nullResponseSchema },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { slug } = request.params as EntryParams;
        await deleteEntry(slug);
        request.log.info({ slug }, 'Entry deleted');
        return reply.code(204).send();
      } catch (err) {
        if (err instanceof UserError) {
          request.log.warn(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        if (err instanceof ServiceError) {
          request.log.error(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.put(
    '/:slug',
    {
      preHandler: [fastify.authenticate, fastify.authorize],
      config: {
        rateLimit: false,
      },
      schema: {
        params: entryParamsSchema,
        body: updateEntrySchema,
        response: {
          200: entryResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { slug } = request.params as EntryParams;
        const entry = await updateEntry(slug, request.body as UpdateEntry);
        request.log.info({ slug }, 'Entry updated');
        return reply.code(200).send(entry);
      } catch (err) {
        if (err instanceof UserError) {
          request.log.warn(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        if (err instanceof ServiceError) {
          request.log.error(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
