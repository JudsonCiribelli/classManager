import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

type JWTPayload = {
  sub: string;
  role: "student" | "manager";
};

export async function CheckRequestJwt(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.headers.authorization;

  if (!token) {
    return reply.status(401).send();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    request.user = payload;
  } catch {
    return reply.status(401).send();
  }
}
