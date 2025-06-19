import fastifyCors from "@fastify/cors";

import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { authController } from "./auth/auth-controller";
import { errorHandler } from "./utils/error-handler";
import fastifyJwt from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

app.addHook("preHandler", (req, reply, next) => {
  req.jwt = app.jwt;
  next();
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Leaky Bucket API",
      description:
        "API for the Leaky Bucket coding challenge proposed by Woovi",
      version: "1.0.0",
    },
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(authController, { prefix: "/auth" });

app.setErrorHandler(errorHandler);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("🚀 Server is running on port 3333");
});
