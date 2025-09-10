"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const getUser = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const user = await db.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (!user) return null;

  return user;
};
