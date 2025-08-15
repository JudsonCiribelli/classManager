import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Create a new course",
        description:
          "Creates a new course with the provided title and description.",
        body: z.object({
          title: z.string(),
          description: z.string(),
        }),
        response: {
          201: z
            .object({ courseId: z.uuid() })
            .describe("Course creation response"),
        },
      },
    },
    async (request, reply) => {
      const body = request.body;
      const courseTitle = body.title;
      const coruseDescription = body.description;

      const result = await db
        .insert(courses)
        .values({
          title: courseTitle,
          description: coruseDescription,
        })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
