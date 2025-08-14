const fastify = require("fastify");
const crypto = require("crypto");

const server = fastify();

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
  const { id } = request.params;
  const course = courses.find((course) => course.id === id);

  if (course) {
    return { course };
  }

  return reply.status(404).send({ message: "Course not found" });
});

server.post("/courses", (request, reply) => {
  const courseId = crypto.randomUUID();
  const courseTitle = request.body.title;
  const coruseDescription = request.body.description;

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
    description: "Learn the fundamentals of machine learning using Python",
  });
  return reply.status(201).send({ courses });
});

server.listen({ port: 3000 }).then(() => {
  console.log("Server listening on http://localhost:3000");
});
