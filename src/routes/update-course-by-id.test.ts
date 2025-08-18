import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeCourse } from "../tests/factories/make-course.ts";

test("Update course a course by id", async () => {
  await server.ready();

  const course = await MakeCourse();

  const response = await request(server.server)
    .patch(`/courses/${course.id}`)
    .set("Content-Type", "application/json")
    .send({ title: course.title });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
    },
  });
});

test("Course id to updated not found", async () => {
  await server.ready();

  const response = await request(server.server)
    .patch(`/courses/1111f75d-b528-30ff-b29a-609f332b5ffe`)
    .set("Content-Type", "application/json")
    .send({ title: "Versão atualizada 2.0 teste" });

  expect(response.status).toBe(404);
});
