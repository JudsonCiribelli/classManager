import fastify from "fastify";
import { db } from "./src/database/client.ts";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { courses } from "./src/database/schema.ts";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { desc, eq } from "drizzle-orm";
import z from "zod";

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
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Class Manager API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses);
  return reply.send({ courses: result });
});

server.get(
  "/courses/:id",
  {
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
    },
  },
  async (request, reply) => {
    const params = request.params;
    const id = params.id;
    const result = await db.select().from(courses).where(eq(courses.id, id));

    if (result.length > 0) {
      return { course: result[0] };
    }

    return reply.status(404).send({ message: "Course not found" });
  }
);

server.post(
  "/courses",
  {
    schema: {
      body: z.object({
        title: z.string(),
        description: z.string(),
      }),
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

    return reply.status(201).send({ course: result });
  }
);

server.delete(
  "/courses/:id",
  {
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
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

    return reply.status(201).send({ message: "Course deleted" });
  }
);

server.patch(
  "/courses/:id",
  {
    schema: {
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
    },
  },
  async (request, reply) => {
    const params = request.params;
    const body = request.body;
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

    return reply.status(201).send({ courses });
  }
);

server.listen({ port: 3000 }).then(() => {
  console.log("Server listening on http://localhost:3000");
});
