import { AboutContent, aboutContentSchema } from '@personal-website/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getAboutContent, updateAboutContent } from '../services/about';

export default async function aboutRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
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
