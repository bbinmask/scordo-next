"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";
import { customClerkMetadata } from "@/utils/clerk";
const createUserHandler = async (data: InputType): Promise<ActionState<InputType, any>> => {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { username, availability, name, email, contact, role, gender, address, dob } = data;

  try {
    const user = await db.user.create({
      data: {
        username,
        availability,
        name,
        email,
        contact,
        address,
        role,
        gender,
        dob,
        clerkId: userId,
      },
    });

    if (!user) {
      return { error: "Failed to create user" };
    }

    await customClerkMetadata(userId, "isProfileCompleted", true);

    revalidatePath(`/profile/${user.id}`);
    return { data: user };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to create" };
  }
};

export const createUser = createSafeAction(CreateUser, createUserHandler);
