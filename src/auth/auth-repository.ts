import { eq } from "drizzle-orm";
import { usersTable } from "../db";
import { db } from "../db/pg";
import { AuthModel } from "./auth-models";

export const authRepository = {
  createUser: async (
    model: AuthModel.CreateUser
  ): Promise<AuthModel.CreateUserResponse> => {
    const { name, email, password, randomPixKey } = model;
    const userToInsert: typeof usersTable.$inferInsert = {
      name,
      email,
      password,
      randomPixKey,
    };

    const [user] = await db.insert(usersTable).values(userToInsert).returning({
      id: usersTable.id,
      randomPixKey: usersTable.randomPixKey,
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  },

  findUserByEmail: async (
    email: string
  ): Promise<AuthModel.User | undefined> => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    return user;
  },

  findUserByRandomPixKey: async (
    randomPixKey: string
  ): Promise<AuthModel.User | undefined> => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.randomPixKey, randomPixKey),
    });
    return user;
  },

  findUserById: async (id: string): Promise<AuthModel.User | undefined> => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    return user;
  },
};
