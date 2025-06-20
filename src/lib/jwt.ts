import { FastifyJWT } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export const JWTAuthMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply
      .status(401)
      .send({ message: "Unauthorized. Please sign in first." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await req.jwt.verify<FastifyJWT["user"]>(token!);

    req.user = decoded;
  } catch (err) {
    return reply
      .status(401)
      .send({ message: "Unauthorized. Please sign in first." });
  }
};
