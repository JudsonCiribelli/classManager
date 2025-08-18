// Vicente.Barros@yahoo.com /1-6

import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses, users } from "../database/schema.ts";
import z from "zod";
import { eq } from "drizzle-orm";
import { verify } from "argon2";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/sessions",
    {
      schema: {
        tags: ["auth"],
        summary: "login",
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
        // response: {
        //   201: z
        //     .object({ courseId: z.uuid() })
        //     .describe("Course creation response"),
        // },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (result.length === 0) {
        return reply.status(400).send({ message: "Credenciais inválidas" });
      }

      const user = result[0];
      const doesPasswordMatch = await verify(user.password, password);

      if (!doesPasswordMatch) {
        return reply.status(400).send({ message: "Credenciais inválidas" });
      }

      return reply.status(200).send({ message: "Usuario logado com sucesso!" });
    }
  );
};
