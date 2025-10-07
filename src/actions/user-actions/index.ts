"use server";

import { db } from "@/lib/db";
import {
  InputCreateUserType,
  InputSendRequestType,
  ReturnCreateUserType,
  ReturnSendRequestType,
} from "./types";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";
import { User } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

const createUserHandler = async (data: InputCreateUserType): Promise<ReturnCreateUserType> => {
  const { userId } = await auth();
  const clerk = await clerkClient();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { username, availability, name, email, contact, role, gender, address, dob } = data;

  try {
    const user = await db.user.create({
      data: {
        username: username.toLowerCase(),
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

    const res = await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        isProfileCompleted: true,
      },
    });

    const [firstName, lastName] = name.split(" ");
    await clerk.users.updateUser(userId, {
      username,
      firstName,
      lastName,
      primaryPhoneNumberID: contact,
    });

    if (!res.publicMetadata?.isProfileCompleted) {
      return { error: "Couldn't complete the profile!" };
    }

    return { data: user };
  } catch (error: any) {
    console.error(error?.message);
    return { error: error.message || "Failed to create user" };
  }
};

export const sendFriendRequest = async (
  data: InputSendRequestType
): Promise<ReturnSendRequestType> => {
  const { userId } = await auth();

  const { addresseeId } = data;

  if (!userId) {
    return { error: "Unauthorized. Please sign in." };
  }

  let requester: User | null;

  try {
    requester = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message || "User not found",
    };
  }

  if (!requester) {
    return {
      error: "User not found",
    };
  }

  if (requester.id === addresseeId) {
    return { error: "You cannot send a friend request to yourself." };
  }

  try {
    const existingFriendship = await db.friendship.findFirst({
      where: {
        OR: [
          { requesterId: requester.id, addresseeId: addresseeId },
          { requesterId: addresseeId, addresseeId: requester.id },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === "ACCEPTED") {
        return { error: "You are already friends with this user." };
      }
      return { error: "A friend request is already pending." };
    }

    await db.friendship.create({
      data: {
        requesterId: requester.id,
        addresseeId: addresseeId,
        status: "PENDING",
      },
    });

    revalidatePath(`/profile/${addresseeId}`);

    return { data: "Friend request sent!" };
  } catch (err) {
    console.error("Error sending friend request:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
};

export const createUser = createSafeAction(CreateUser, createUserHandler);
