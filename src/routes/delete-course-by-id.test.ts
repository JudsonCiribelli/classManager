import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

test("delete a course by id", async () => {
  await server.ready();

  const course = await MakeCourse();
  const { token } = await makeAuthenticatedUser("manager");

  const response = await request(server.server)
    .delete(`/courses/${course.id}`)
    .set("Authorization", token);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Course deleted",
  });
});

test("return 404 for non existing course", async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser("manager");

  const response = await request(server.server)
    .delete(`/courses/bb5aba42-c003-1b2c-a123-1e2345b6c7e8`)
    .set("Authorization", token);

  expect(response.status).toBe(404);
});
