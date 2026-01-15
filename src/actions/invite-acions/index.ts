"use server";

import { currentUser } from "@/lib/currentUser";
import {
  InputInviteUserToTeam,
  InputTypeForAccept,
  ReturnInviteUserToTeam,
  ReturnTypeForAccept,
} from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { AcceptRequest, InviteUserToTeam } from "./schema";
import { Player } from "@/generated/prisma";

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

const acceptReqHandler = async (data: InputTypeForAccept): Promise<ReturnTypeForAccept> => {
  const { fromId, reqId, teamId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Unauthorized request!",
    };

  let request, team, player: Player | null;

  try {
    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        players: true,
      },
    });

    if (team?.ownerId !== user.id)
      return {
        error: "Only owner can accept",
      };

    player = await db.player.findFirst({
      where: {
        userId: fromId,
      },
    });

    if (!player)
      return {
        error: `The user is not a player!`,
      };

    if (team.players.findIndex((pl) => pl.id === player?.id))
      return {
        error: "Player is already in the team!",
      };

    team.players.push(player);

    // request = await db.teamRequest.delete({
    //   where: {
    //     id: reqId,
    //   },
    // });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);

  return { data: team };
};

export const inviteInTeam = createSafeAction(InviteUserToTeam, inviteInTeamHandler);

export const acceptTeamRequest = createSafeAction(AcceptRequest, acceptReqHandler);
