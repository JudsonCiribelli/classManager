import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

test("Update course a course by id", async () => {
  await server.ready();

  const course = await MakeCourse();
  const { token } = await makeAuthenticatedUser("manager");

  const response = await request(server.server)
    .patch(`/courses/${course.id}`)
    .set("Content-Type", "application/json")
    .set("Authorization", token)
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
  const { token } = await makeAuthenticatedUser("manager");

  const response = await request(server.server)
    .patch(`/courses/4fcc8e64-9271-4a1a-bdd5-5b2c92c27c7d`)
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({ title: "Versão atualizada 3.0 teste" });

  expect(response.status).toBe(404);
});
