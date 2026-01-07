"use server";

import { db } from "@/lib/db";
import {
  InputRecievedRequestType,
  InputCreateUserType,
  InputSentRequestType,
  ReturnAcceptRequestType,
  ReturnCreateUserType,
  ReturnSentRequestType,
} from "./types";
import Error from "http-errors";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { RecievedRequest, CreateUser, SentRequest, CreatePlayer } from "./schema";
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

    if (role === "player") {
      await db.player.create({
        data: {
          userId: user.id,
          teamId: user.id,
        },
      });
    }

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

const createPlayerHandler = async (): Promise<any> => {
  const user = await currentUser();

  if (!user) return;

  let player;

  try {
    const alreadyPlayer = await db.player.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (alreadyPlayer) return;

    player = await db.player.create({
      data: {
        userId: user.id,
        teamId: user.id,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/profile`);

  return { data: player };
};

const sendFriendRequestHandler = async (
  data: InputSentRequestType
): Promise<ReturnSentRequestType> => {
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

const acceptRequestHandler = async (
  data: InputRecievedRequestType
): Promise<ReturnAcceptRequestType> => {
  const user = await currentUser();

  if (!user)
    return {
      error: "Unauthorized",
    };

  const { reqId, reqUsername } = data;

  if (reqId.trim() === "" || reqUsername.trim() === "")
    return {
      error: "Request not found",
    };

  let request;
  try {
    request = await db.friendship.update({
      where: {
        id: reqId,
      },
      data: {
        status: "ACCEPTED",
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/profile`);
  revalidatePath(`/users/${reqUsername}`);

  return { data: request };
};

const cancelFriendRequestHandler = async (
  data: InputSentRequestType
): Promise<ReturnSentRequestType> => {
  const { addresseeId, username } = data;
  const user = await currentUser();

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

const removeFriendHandler = async (data: InputSentRequestType): Promise<ReturnSentRequestType> => {
  const { addresseeId, username } = data;
  const user = await currentUser();

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
  revalidatePath(`/profile`);
  return { data: friends };
};

const declineRequestHandler = async () => {};

export const createUser = createSafeAction(CreateUser, createUserHandler);

export const createPlayer = createSafeAction(CreatePlayer, createPlayerHandler);

export const sendFriendRequest = createSafeAction(SentRequest, sendFriendRequestHandler);

export const acceptRequest = createSafeAction(RecievedRequest, acceptRequestHandler);

export const cancelFriendRequest = createSafeAction(SentRequest, cancelFriendRequestHandler);

export const removeFriend = createSafeAction(SentRequest, removeFriendHandler);
