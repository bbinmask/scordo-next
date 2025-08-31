"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { z } from "zod";
import { db } from "@/lib/db";
const userSchema = z.object({
  id: z.any(),
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
});

async function handler(input: {
  name: string;
  email: string;
}): Promise<keyof typeof userSchema | { error: any }> {
  // validate
  console.log(input);
  const parsed = userSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  const data = await db.user.count({
    where: {
      id: "1235",
    },
  });

  console.log(data);

  const { name, email } = parsed.data;

  // pretend saving to DB
  await new Promise((r) => setTimeout(r, 1000));

  return { id: Date.now().toString(), name, email };
}

export const actionOK = createSafeAction(userSchema, handler);
