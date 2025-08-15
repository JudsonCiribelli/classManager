import fastify from "fastify";
import crypto from "node:crypto";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";
import { eq } from "drizzle-orm";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses);
  return reply.send({ courses: result });
});

server.get("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };
  const params = request.params as Params;
  const id = params.id;
  const result = await db.select().from(courses).where(eq(courses.id, id));

  if (result.length > 0) {
    return { course: result[0] };
  }

  return reply.status(404).send({ message: "Course not found" });
});

server.post("/courses", async (request, reply) => {
  type CourseBody = {
    title: string;
    description: string;
  };

  const body = request.body as CourseBody;
  const courseTitle = body.title;
  const coruseDescription = body.description;

  if (!courseTitle) {
    return reply.status(400).send({ message: "Course title is required" });
  }

  if (!coruseDescription) {
    return reply
      .status(400)
      .send({ message: "Course Description is required" });
  }

  const result = await db
    .insert(courses)
    .values({
      title: courseTitle,
      description: coruseDescription,
    })
    .returning();

  return reply.status(201).send({ course: result });
});

server.delete("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const id = params.id;
  const result = await db.select().from(courses).where(eq(courses.id, id));

  if (!result) {
    return reply.status(404).send({ message: "Course not foun" });
  }
  await db.delete(courses).where(eq(courses.id, id));

  return reply.status(201).send({ message: "Course deleted" });
});

server.patch("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
    title?: string;
    description?: string;
  };

  const params = request.params as Params;
  const body = request.body as Params;
  const courseTitle = body.title;
  const courseDescription = body.description;
  const id = params.id;

  const course = await db.select().from(courses).where(eq(courses.id, id));

  if (!course) {
    return reply.status(404).send({ message: "Course not found" });
  }

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

  return reply.status(201).send({ courses });
});

server.listen({ port: 3000 }).then(() => {
  console.log("Server listening on http://localhost:3000");
});
