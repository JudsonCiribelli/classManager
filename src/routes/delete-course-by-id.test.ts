import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeCourse } from "../tests/factories/make-course.ts";

test("delete a course by id", async () => {
  await server.ready();

  const course = await MakeCourse();

  const response = await request(server.server).delete(`/courses/${course.id}`);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Course deleted",
  });
});
