import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { MakeUser } from "../tests/factories/make-user.ts";

test("login", async () => {
  await server.ready();

  const { user, passwordBeforeHash } = await MakeUser();

  const response = await request(server.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({
      email: user.email,
      password: passwordBeforeHash,
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    token: expect.any(String),
  });
});
