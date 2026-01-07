import type { AboutContent} from '@personal-website/shared';
import { aboutContentSchema } from '@personal-website/shared';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getAboutContent, updateAboutContent } from '../services/about';

export default async function aboutRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      config: {
        rateLimit: false,
      },
      schema: {
        response: {
          200: aboutContentSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const aboutContent = await getAboutContent();
        request.log.info('About content fetched');
        reply.status(200).send(aboutContent);
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  fastify.put(
    '/',
    {
      preHandler: [fastify.authenticate, fastify.authorize],
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: aboutContentSchema,
        response: { 200: aboutContentSchema },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const updatedAboutContent = await updateAboutContent(
          request.body as AboutContent
        );
        request.log.info('About content updated');
        reply.status(200).send(updatedAboutContent);
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
