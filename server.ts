import fastify from "fastify";
import crypto from "node:crypto";

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

const courses = [
  {
    id: "1",
    title: "Introduction to JavaScript",
    description:
      "Learn the basics of JavaScript, the programming language of the web.",
  },
  {
    id: "2",
    title: "Advanced Node.js",
    description:
      "Dive deeper into Node.js, exploring its core modules and asynchronous programming.",
  },
  {
    id: "3",
    title: "Web Development with React",
    description:
      "Build dynamic user interfaces using React, a popular JavaScript library.",
  },
];

server.get("/courses", () => {
  return { courses };
});

server.get("/courses/:id", (request, reply) => {
  type Params = {
    id: string;
  };
  const params = request.params as Params;
  const id = params.id;
  const course = courses.find((course) => course.id === id);

  if (course) {
    return { course };
  }

  return reply.status(404).send({ message: "Course not found" });
});

server.post("/courses", (request, reply) => {
  type CourseBody = {
    title: string;
    description: string;
  };

  const courseId = crypto.randomUUID();
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
  courses.push({
    id: courseId,
    title: courseTitle,
    description: coruseDescription,
  });
  return reply.status(201).send({ courses });
});

server.listen({ port: 3000 }).then(() => {
  console.log("Server listening on http://localhost:3000");
});
