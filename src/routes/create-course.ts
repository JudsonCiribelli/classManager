import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { CheckRequestJwt } from "./hooks/check-request-jwt.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      preHandler: [CheckRequestJwt],
      schema: {
        tags: ["courses"],
        summary: "Create a new course",
        description:
          "Creates a new course with the provided title and description.",
        body: z.object({
          title: z.string(),
        }),
        response: {
          201: z
            .object({ courseId: z.uuid() })
            .describe("Course creation response"),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;

      const result = await db
        .insert(courses)
        .values({
          title: courseTitle,
        })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
