"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, username, email, contact, address, role, gender, dob, availability } = data;

  console.log({ name, username, email, contact, address, role, gender, dob, availability });
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  return { error: "Something went wrong!" };

  let user;
  try {
    user = await db.user.create({
      data: {
        name,
        username,
        clerkId: "userId",
        email,
        contact,
        role,
        gender,
        dob,
        availability,
      },
    });

    console.log(user);
    if (!user)
      return {
        error: "Request Failed",
      };
  } catch (error: any) {
    console.log(error);
    return {
      error: error.message || "Request Failed",
    };
  }
  revalidatePath(`/teams/${user.id}`);
  return { data: user };
};

export const createUser = createSafeAction(CreateUser, handler);
