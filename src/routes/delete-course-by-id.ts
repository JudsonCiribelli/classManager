import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { eq } from "drizzle-orm";

export const deleteCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Delete a course by ID",
        description: "Deletes a course with the specified ID.",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z
            .object({ message: z.string() })
            .describe("Course deletion response")
            .describe("Course deleted successfully"),
          404: z
            .object({ message: z.string() })
            .describe("Course not found response")
            .describe("Course not found"),
        },
      },
    },
    async (request, reply) => {
      const params = request.params;
      const id = params.id;
      const result = await db.select().from(courses).where(eq(courses.id, id));

      if (!result) {
        return reply.status(404).send({ message: "Course not foun" });
      }
      await db.delete(courses).where(eq(courses.id, id));

      return reply.status(200).send({ message: "Course deleted" });
    }
  );
};
