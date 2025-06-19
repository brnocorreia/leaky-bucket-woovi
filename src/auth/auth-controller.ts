import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthModel } from "./auth-models";
import { authService } from "./auth-service";

export async function authController(app: FastifyInstance) {
  // Sign up
  app.withTypeProvider<ZodTypeProvider>().post(
    "/signup",
    {
      schema: {
        summary: "Sign up an user",
        tags: ["auth"],
        body: AuthModel.createUserRequest,
        response: {
          201: AuthModel.createUserResponse,
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } =
        request.body as AuthModel.CreateUserRequest;

      const user = await authService.createUser({ name, email, password });

      return reply.status(201).send(user);
    }
  );

  // Sign in
  app.withTypeProvider<ZodTypeProvider>().post(
    "/signin",
    {
      schema: {
        summary: "Sign in an user",
        tags: ["auth"],
        body: AuthModel.signInUserRequest,
        response: {
          200: AuthModel.signInUserResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as AuthModel.SignInUser;

      const { id, name } = await authService.signIn({ email, password });

      const accessToken = request.jwt.sign(
        { id, name },
        {
          expiresIn: "7d",
        }
      );

      return reply.status(200).send({ accessToken });
    }
  );
}
