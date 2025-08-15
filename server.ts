import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";

import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { createCourseRoute } from "./src/routes/create-course.ts";
import { getCourseRoute } from "./src/routes/get-courses.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { deleteCourseByIdRoute } from "./src/routes/delete-course-by-id.ts";
import scalarAPIReference from "@scalar/fastify-api-reference";

import { updateCourseByIdRoute } from "./src/routes/update-course-by-id.ts";

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

if (process.env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Class Manager API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "kepler",
    },
  });
}

server.register(getCourseRoute);
server.register(getCourseByIdRoute);
server.register(createCourseRoute);
server.register(deleteCourseByIdRoute);
server.register(updateCourseByIdRoute);

server.listen({ port: 3000 }).then(() => {
  console.log("Server listening on http://localhost:3000");
});
