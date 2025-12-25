import {
  entryResponseSchema,
  RecommendationsParams,
  recommendationsParamsSchema,
  recommendationsResponseSchema,
  TopMatchParams,
  topMatchParamsSchema,
} from '@personal-website/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServiceError, UserError } from '../errors';
import {
  getRecommendationsByQuery,
  getRecommendationsBySlug,
  getTopMatchByQuery,
} from '../services/recommendations';

export default async function recommendationsRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
      schema: {
        querystring: recommendationsParamsSchema,
        response: {
          200: recommendationsResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        query,
        slug,
        excludeSlugs = [],
      } = request.query as RecommendationsParams;
      try {
        if (query) {
          const excludeSlugsArray = Array.isArray(excludeSlugs)
            ? excludeSlugs
            : [excludeSlugs];
          const recommendations = await getRecommendationsByQuery(
            query,
            excludeSlugsArray
          );
          request.log.info({ query }, 'Recommendations fetched');
          return reply.code(200).send(recommendations);
        }
        if (slug) {
          const recommendations = await getRecommendationsBySlug(slug);
          request.log.info({ slug }, 'Recommendations fetched');
          return reply.code(200).send(recommendations);
        }
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
    '/top-match/:query',
    {
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
      schema: {
        params: topMatchParamsSchema,
        response: {
          200: entryResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { query } = request.params as TopMatchParams;
      try {
        const topMatch = await getTopMatchByQuery(query);
        request.log.info({ query, topMatch }, 'Top match fetched');
        return reply.code(200).send(topMatch);
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
