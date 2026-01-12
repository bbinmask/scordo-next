"use server";

import { currentUser } from "@/lib/currentUser";
import { InputInviteUserToTeam, ReturnInviteUserToTeam } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { InviteUserToTeam } from "./schema";

const inviteInTeamHandler = async (
  data: InputInviteUserToTeam
): Promise<ReturnInviteUserToTeam> => {
  const user = await currentUser();

  if (!user)
    return {
      error: "UNAUTHORIZED",
    };
  const { teamId, username, toId } = data;

  let request;

  try {
    const existingReq = await db.teamRequest.findFirst({
      where: {
        teamId,
        to: {
          username,
        },
      },
    });

    if (existingReq)
      return {
        error: "Request already sent!",
      };

    request = await db.teamRequest.create({
      data: {
        teamId,
        toId,
        fromId: user.id,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/users/${username}`);

  return {
    data: request,
  };
};

export const inviteInTeam = createSafeAction(InviteUserToTeam, inviteInTeamHandler);
