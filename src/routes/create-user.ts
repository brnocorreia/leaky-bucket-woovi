import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { usersTable } from "../db/schema";
import { FastifyInstance } from "fastify";
import { db } from "../lib/pg";
import { eq } from "drizzle-orm";

const createUserSchema = {
  summary: "Create an user",
  tags: ["users"],
  body: z.object({
    name: z.string({ message: "Name is required" }).min(4).max(255),
    email: z.string({ message: "Email is required" }).email({
      message: "Invalid email",
    }),
  }),
  response: {
    201: z.object({
      userId: z.string().uuid(),
      randomPixKey: z.string().uuid(),
    }),
  },
} as const;

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: createUserSchema,
    },
    async (request, reply) => {
      const { name, email } = request.body as {
        name: string;
        email: string;
      };

      const userAlreadyExists = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (userAlreadyExists) {
        throw new Error("User with same email already exists", {
          cause: {
            email,
          },
        });
      }

      const randomPixKey = crypto.randomUUID();

      const userToInsert: typeof usersTable.$inferInsert = {
        name,
        email,
        randomPixKey,
      };

      const [user] = await db
        .insert(usersTable)
        .values(userToInsert)
        .returning({
          id: usersTable.id,
          randomPixKey: usersTable.randomPixKey,
        });

      if (!user) {
        throw new Error("Failed to create user");
      }

      return reply.status(201).send({
        userId: user.id,
        randomPixKey: user.randomPixKey,
      });
    }
  );
}
