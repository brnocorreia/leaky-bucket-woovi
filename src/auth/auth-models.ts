import { z } from "zod";
import { usersTable } from "../db";

export namespace AuthModel {
  export type User = typeof usersTable.$inferSelect;

  export const user = z.object({
    id: z
      .string()
      .uuid({ message: "Invalid user id. It must be a valid UUID" }),
    name: z
      .string({ message: "Name is required" })
      .min(4, { message: "Name must be at least 4 characters" })
      .max(255, { message: "Name must be less than 255 characters" }),
    email: z.string({ message: "Email is required" }).email({
      message: "Invalid email. It must be a valid email address",
    }),
    password: z
      .string({ message: "Password is required" })
      .min(4, { message: "Password must be at least 4 characters" })
      .max(255, { message: "Password must be less than 255 characters" })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
    randomPixKey: z
      .string({ message: "Random pix key is required" })
      .uuid({ message: "Invalid random pix key. It must be a valid UUID" }),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  export const userResponse = user.omit({
    password: true,
  });

  export type UserResponse = z.infer<typeof userResponse>;

  export const createUser = user.pick({
    name: true,
    email: true,
    password: true,
    randomPixKey: true,
  });

  export type CreateUser = z.infer<typeof createUser>;

  export const createUserRequest = createUser.omit({
    randomPixKey: true,
  });
  export type CreateUserRequest = z.infer<typeof createUserRequest>;

  export const createUserResponse = user.pick({
    id: true,
    randomPixKey: true,
  });
  export type CreateUserResponse = z.infer<typeof createUserResponse>;

  export const signInUser = user.pick({
    id: true,
    email: true,
    password: true,
  });
  export type SignInUser = z.infer<typeof signInUser>;

  export const signInUserRequest = signInUser.omit({
    id: true,
  });
  export type SignInUserRequest = z.infer<typeof signInUserRequest>;

  export const signInUserResponse = z.object({
    accessToken: z.string(),
  });
  export type SignInUserResponse = z.infer<typeof signInUserResponse>;
}
