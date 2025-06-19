import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { authController } from "./auth/auth-controller";
import { errorHandler } from "./utils/error-handler";
import fastifyJwt from "@fastify/jwt";

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

// app.decorate(
//   "authenticate",
//   async (request: FastifyRequest, reply: FastifyReply) => {
//     try {
//       const token = request.headers.authorization?.startsWith("Bearer ")
//         ? request.headers.authorization.split(" ")[1]
//         : null;

//       if (!token) {
//         throw new Error("Unauthorized");
//       }
//       await verifyToken(token);
//     } catch (error) {
//       reply.status(401).send({ message: "Unauthorized" });
//     }
//   }
// );

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Leaky Bucket API",
      description:
        "API for the Leaky Bucket coding challenge proposed by Woovi",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(authController, { prefix: "/auth" });

app.setErrorHandler(errorHandler);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("🚀 Server is running on port 3333");
});
