import {
  CreateEntry,
  createEntrySchema,
  entriesResponseSchema,
  entryResponseSchema,
  GetEntryParams,
  getEntryParamsSchema,
} from '@personal-website/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  EntryAlreadyExistsError,
  EntryNotFoundError,
  ImageMetadataError,
  OpenAIError,
  S3Error,
} from '../errors';
import { createEntry, getEntries, getEntry } from '../services/entries';

export default async function entriesRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate, fastify.authorize],
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
        request.log.info({ entryId: entry.id }, 'Entry created');
        return reply.status(201).send(entry);
      } catch (err) {
        if (err instanceof EntryAlreadyExistsError) {
          request.log.warn(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        if (
          err instanceof OpenAIError ||
          err instanceof S3Error ||
          err instanceof ImageMetadataError
        ) {
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
        params: getEntryParamsSchema,
        response: {
          200: entryResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { slug } = request.params as GetEntryParams;
        const entry = await getEntry(slug);
        request.log.info({ slug, entryId: entry.id }, 'Entry fetched');
        return reply.code(200).send(entry);
      } catch (err) {
        if (err instanceof EntryNotFoundError) {
          request.log.warn(err);
          return reply.status(err.statusCode).send({ error: err.message });
        }
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
