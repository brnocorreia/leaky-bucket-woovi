import { AuthModel } from "./auth-models";
import { authRepository } from "./auth-repository";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const authService = {
  createUser: async (
    model: AuthModel.CreateUserRequest
  ): Promise<AuthModel.CreateUserResponse> => {
    const { name, email, password } = model;

    const randomPixKey = crypto.randomUUID();

    const userAlreadyExists = await authRepository.findUserByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User with same email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      randomPixKey,
    });

    return user;
  },

  signIn: async (
    model: AuthModel.SignInUserRequest
  ): Promise<AuthModel.UserResponse> => {
    const { email, password } = model;

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error(
        "Invalid credentials: User not found with the given email"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials: Invalid password");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      randomPixKey: user.randomPixKey,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
};
