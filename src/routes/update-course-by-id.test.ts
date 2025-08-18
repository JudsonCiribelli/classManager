import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeCourse } from "../tests/factories/make-course.ts";
import { randomUUID } from "crypto";

test("Update course a course by id", async () => {
  await server.ready();

  const courseId = randomUUID();

  const response = await request(server.server).patch(`/courses/${courseId}`);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    course: {
      title: expect.any(String),
    },
  });
});
