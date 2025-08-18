import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { eq } from "drizzle-orm";
import { CheckRequestJwt } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const updateCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.patch(
    "/courses/:id",
    {
      preHandler: [CheckRequestJwt, checkUserRole("manager")],
      schema: {
        tags: ["Courses"],
        summary: "Update a course by ID",
        description: "Updates a course with the specified ID.",
        params: z.object({
          id: z.uuid(),
        }),
        body: z
          .object({
            title: z.string().nonempty({ message: "Title cannot be empty" }),
          })
          .partial(),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title: courseTitle } = request.body;
      const id = request.params.id;

      const [updatedCourse] = await db
        .update(courses)
        .set({ title: courseTitle })
        .where(eq(courses.id, id))
        .returning();

      if (!updatedCourse) {
        return reply.status(404).send({ message: "Course not found!" });
      }

      return reply.status(200).send({ course: updatedCourse });
    }
  );
};
