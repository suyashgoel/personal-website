import Fastify, { FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { logger } from "./lib/logger";

export function buildApp(opts: FastifyServerOptions = {}) {
  const app = Fastify({
    ...opts,
    logger,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(cors, {
    origin: "*",
  });

  app.get("/health", async () => {
    return { status: "ok", brain: "active" };
  });

  return app;
}
