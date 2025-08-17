import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export const MakeCourse = async () => {
  const result = await db
    .insert(courses)
    .values({
      title: faker.lorem.words(4),
      description: faker.lorem.paragraphs(2),
    })
    .returning();

  return result[0];
};
