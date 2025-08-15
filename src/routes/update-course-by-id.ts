import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { eq } from "drizzle-orm";

export const updateCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.patch(
    "/courses/:id",
    {
      schema: {
        tags: ["Courses"],
        summary: "Update a course by ID",
        description: "Updates a course with the specified ID.",
        params: z.object({
          id: z.uuid(),
          title: z
            .string()
            .nonempty()
            .nonempty({ message: "Title cannot be empty" }),
          description: z
            .string()
            .nonempty({ message: "Description cannot be empty" }),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string(),
            }),
          }),
          400: z.null().describe("Bad Request").describe("Invalid input data"),
        },
      },
    },
    async (request, reply) => {
      const params = request.params;
      const courseTitle = params.title;
      const courseDescription = params.description;
      const id = params.id;

      const course = await db.select().from(courses).where(eq(courses.id, id));

      if (courseTitle) {
        course[0].title = courseTitle;
      }

      if (courseDescription) {
        course[0].description = courseDescription;
      }

      await db
        .update(courses)
        .set({
          title: course[0].title,
          description: course[0].description,
        })
        .where(eq(courses.id, id));

      return reply.send({ course: course[0] });
    }
  );
};
