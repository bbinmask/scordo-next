"use server";

import { db } from "@/lib/db";
import {
  InputCreateUserType,
  InputFriendRequestType,
  ReturnCreateUserType,
  ReturnFriendRequestType,
} from "./types";
import Error from "http-errors";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { CreateUser, FriendRequest } from "./schema";
import { User } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/currentUser";

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

const sendFriendRequestHandler = async (
  data: InputFriendRequestType
): Promise<ReturnFriendRequestType> => {
  const { userId } = await auth();

  const { addresseeId, username } = data;

  if (!userId) {
    return { error: "Unauthorized. Please sign in." };
  }

  if (!addresseeId) {
    return {
      error: "User not found",
    };
  }

  let requester: User | null;

  try {
    requester = await currentUser();
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

    const friendship = await db.friendship.create({
      data: {
        requesterId: requester.id,
        addresseeId,
        status: "PENDING",
      },
    });

    revalidatePath(`/users/${username}`);

    return { data: { data: friendship, message: "Friend request sent!" } };
  } catch (err) {
    console.error("Error sending friend request:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
};

const widthdrawRequestHanlder = async (
  data: InputFriendRequestType
): Promise<ReturnFriendRequestType> => {
  const { addresseeId, username } = data;
  const user = await currentUser();
  console.log(Error.BadRequest);
  console.log("Error");

  if (!addresseeId || !user) return { error: Error.BadRequest as unknown as string };

  let requests;
  try {
    requests = await db.friendship.delete({
      where: {
        requesterId_addresseeId: {
          addresseeId,
          requesterId: user.id,
        },
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/users/${username}`);
  return { data: requests };
};

const removeFriendHandler = async (
  data: InputFriendRequestType
): Promise<ReturnFriendRequestType> => {
  const { addresseeId, username } = data;
  const user = await currentUser();
  console.log(Error.BadRequest);

  if (!addresseeId || !user) return { error: Error.BadRequest as unknown as string };

  let friends;
  try {
    friends = await db.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: user.id, addresseeId: addresseeId },
          { requesterId: addresseeId, addresseeId: user.id },
        ],
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/users/${username}`);
  return { data: friends };
};

export const createUser = createSafeAction(CreateUser, createUserHandler);

export const sendFriendRequest = createSafeAction(FriendRequest, sendFriendRequestHandler);

export const widthdrawFriendRequest = createSafeAction(FriendRequest, widthdrawRequestHanlder);

export const removeFriend = createSafeAction(FriendRequest, removeFriendHandler);
