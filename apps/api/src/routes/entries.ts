import {
  CreateEntry,
  createEntrySchema,
  entryResponseSchema,
} from '@personal-website/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  EntryAlreadyExistsError,
  ImageMetadataError,
  OpenAIError,
  S3Error,
} from '../errors';
import { createEntry } from '../services/entries';

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
        request.log.info({ entryId: entry!.id }, 'Entry created');
        return reply.status(201).send(entry);
      } catch (err) {
        if (err instanceof EntryAlreadyExistsError) {
          request.log.warn(err);
          return reply.status(409).send({ error: err.message });
        }
        if (
          err instanceof OpenAIError ||
          err instanceof S3Error ||
          err instanceof ImageMetadataError
        ) {
          request.log.error(err);
          return reply.status(500).send({ error: err.message });
        }
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
