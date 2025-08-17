import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeCourse } from "../tests/factories/make-course.ts";

test("get a course by id", async () => {
  await server.ready();

  const course = await MakeCourse();

  const response = await request(server.server).get(`/courses/${course.id}`);

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

  const response = await request(server.server).get(
    `/courses/4444f75d-b490-47ff-b30a-444f332b5ffe`
  );

  expect(response.status).toBe(404);
});
