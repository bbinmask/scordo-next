"use server";

import { currentUser } from "@/lib/currentUser";
import {
  InputInviteUserToTeam,
  InputTypeForAccept,
  InputTypeForDecline,
  ReturnInviteUserToTeam,
  ReturnTypeForAccept,
  ReturnTypeForDecline,
} from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { AcceptRequest, DeclineRequest, InviteUserToTeam } from "./schema";
import { Player } from "@/generated/prisma";
import { error } from "console";

const inviteInTeamHandler = async (
  data: InputInviteUserToTeam
): Promise<ReturnInviteUserToTeam> => {
  const user = await currentUser();

  if (!user)
    return {
      error: "UNAUTHORIZED",
    };
  const { teamId, username, fromId } = data;

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
        toId: user.id,
        fromId,
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
  const { reqId, teamId, fromId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Unauthorized request!",
    };

  let request, team, player: Player | null;

  try {
    player = await db.player.findFirst({
      where: {
        userId: fromId,
      },
    });

    if (!player)
      return {
        error: `The user is not a player!`,
      };

    request = await db.teamRequest.findUnique({
      where: {
        id: reqId,
      },
    });

    if (!request)
      return {
        error: "Request was widthdrawn!",
      };

    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
      select: {
        players: {
          select: {
            userId: true,
          },
        },
        ownerId: true,
        captainId: true,
        abbreviation: true,
      },
    });

    if (!team)
      return {
        error: "Cannout find the team!",
      };

    if (team.ownerId !== user.id && team.captainId !== user.id)
      return {
        error: "Only owner can accept",
      };

    if (team.players.findIndex((pl) => pl.userId === fromId) !== -1)
      return {
        error: "Already in the team!",
      };
    team = await db.team.update({
      where: {
        id: teamId,
      },
      data: {
        players: {
          connect: {
            id: player.id,
          },
        },
      },
      include: {
        players: true,
      },
    });

    request = await db.teamRequest.delete({
      where: {
        id: reqId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);

  return { data: team };
};

const declineReqHandler = async (data: InputTypeForDecline): Promise<ReturnTypeForDecline> => {
  const { id, teamId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Unauthorized!",
    };

  let team;

  try {
    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team)
      return {
        error: "Team not found!",
      };

    if (team.ownerId !== user.id && team.captainId !== user.id)
      return {
        error: "Unauthorized",
      };

    await db.teamRequest.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);
  revalidatePath(`/teams`);

  return {
    data: team,
  };
};

export const inviteInTeam = createSafeAction(InviteUserToTeam, inviteInTeamHandler);

export const acceptTeamRequest = createSafeAction(AcceptRequest, acceptReqHandler);

export const declineTeamRequest = createSafeAction(DeclineRequest, declineReqHandler);
