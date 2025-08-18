import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

test("get a course by id", async () => {
  await server.ready();

  const course = await MakeCourse();
  const { token } = await makeAuthenticatedUser("student");

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set("Authorization", token);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
    },
  });
});

test("return 404 for non existing course", async () => {
  await server.ready();
  const { token } = await makeAuthenticatedUser("student");

  const response = await request(server.server)
    .get(`/courses/4444f75d-b490-47ff-b30a-444f332b5ffe`)
    .set("Authorization", token);

  expect(response.status).toBe(404);
});
