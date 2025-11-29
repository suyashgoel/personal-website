import { Role } from '@personal-website/shared';

export type JWTPayload = {
  sub: number;
  role: Role;
};

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    authorize(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  interface FastifyRequest {
    user: JWTPayload;
  }
}
