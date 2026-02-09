"use server";

import { db } from "@/lib/db";
import {
  InputTypeForCreate,
  InputTypeForInitializeMatch,
  InputTypeForOfficials,
  InputTypeForRemove,
  InputTypeForRequest,
  ReturnTypeForCreate,
  ReturnTypeForInitialieMatch,
  ReturnTypeForOfficials,
  ReturnTypeForRemove,
  ReturnTypeForRequest,
} from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { AddOfficials, CreateMatch, InitializeMatch, RemoveOfficial, Request } from "./schema";
import { currentUser } from "@/lib/currentUser";
import { ERROR_CODES } from "@/constants";
import { Inning, Match } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

const createMatchHandler = async (data: InputTypeForCreate): Promise<ReturnTypeForCreate> => {
  const {
    category,
    date,
    location,
    matchOfficials,
    overLimit,
    overs,
    teamAId,
    teamBId,
    tossDecision,
    tossWinner,
    venue,
    playerLimit,
    tournamentId,
  } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: ERROR_CODES.UNAUTHORIZED.message,
    };

  let match: Match, tournament, matchOfficial;

  try {
    const teamA = await db.team.findUnique({
      where: {
        id: teamAId,
      },
    });

    if (!teamA)
      return {
        error: "Team A not found!",
      };

    const teamB = await db.team.findUnique({
      where: {
        id: teamBId,
      },
    });

    if (!teamB)
      return {
        error: "Team B not found!",
      };

    if (tournamentId) {
      tournament = await db.tournament.findUnique({
        where: {
          id: tournamentId,
        },
      });

      if (!tournament)
        return {
          error: "Tournament not found!",
        };
    }

    match = await db.match.create({
      data: {
        category,
        date: new Date(date),
        location,
        overLimit,
        overs,
        teamAId,
        teamBId,
        tossDecision,
        tossWinner,
        venue,
        playerLimit,
        organizerId: user.id,
        ...(tournamentId && { tournamentId }),
      },
    });

    if (!match)
      return {
        error: "Could not create match!",
      };

    if (matchOfficials && matchOfficials.length > 0) {
      matchOfficial = await db.matchOfficial.createMany({
        data: matchOfficials?.map((official: any) => ({
          ...official,
          matchId: match.id,
        })),
      });
    }
  } catch (error) {
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/matches`);
  return {
    data: match,
  };
};

const addOfficialsHandler = async (
  data: InputTypeForOfficials
): Promise<ReturnTypeForOfficials> => {
  const { matchOfficials, matchId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: ERROR_CODES.UNAUTHORIZED.message,
    };

  let matchOfficial, match;

  try {
    match = await db.match.findUnique({
      where: {
        id: matchId,
      },
    });

    if (!match)
      return {
        error: "Match not found",
      };

    matchOfficial = await db.matchOfficial.findMany({
      where: {
        matchId,
      },
    });

    if (matchOfficial.length >= 5)
      return {
        error: "Only 5 officials are allowed!",
      };

    await db.matchOfficial.createMany({
      data: matchOfficials.map((official) => ({
        ...official,
        matchId: matchId,
      })),
    });

    matchOfficial = await db.matchOfficial.findMany({
      where: {
        matchId,
      },
    });
  } catch (error) {
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/matches/${matchId}`);

  return {
    data: matchOfficial,
  };
};

const removeOfficialHandler = async (data: InputTypeForRemove): Promise<ReturnTypeForRemove> => {
  const user = await currentUser();

  return {
    data: true,
  };
};

const declineMatchRequestHandler = async (
  data: InputTypeForRequest
): Promise<ReturnTypeForRequest> => {
  const { id } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Login required!",
    };

  let match;
  try {
    match = await db.match.findUnique({
      where: {
        id,
      },
      select: {
        teamB: {
          select: {
            ownerId: true,
            captainId: true,
          },
        },
      },
    });

    if (!match)
      return {
        error: "Match not found!",
      };

    if (match.teamB.ownerId !== user.id && match.teamB.captainId !== user.id)
      return {
        error: "Only owner or captain can decline",
      };

    match = await db.match.delete({
      where: { id },
    });
  } catch (error) {
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/teams`);

  return {
    data: match,
  };
};
const acceptMatchRequestHandler = async (
  data: InputTypeForRequest
): Promise<ReturnTypeForRequest> => {
  const { id } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Login required!",
    };

  let match;
  try {
    match = await db.match.findUnique({
      where: {
        id,
      },
      select: {
        teamB: {
          select: {
            ownerId: true,
            captainId: true,
          },
        },
      },
    });

    if (!match)
      return {
        error: "Match not found!",
      };

    if (match.teamB.ownerId !== user.id && match.teamB.captainId !== user.id)
      return {
        error: "Only owner or captain can decline",
      };

    match = await db.match.update({
      where: { id },
      data: {
        requestStatus: "accepted",
      },
    });
  } catch (error) {
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/teams`);

  return {
    data: match,
  };
};

const initializeMatchHandler = async (
  data: InputTypeForInitializeMatch
): Promise<ReturnTypeForInitialieMatch> => {
  const {
    bowlerId,
    matchId,
    nonStrikerId,
    strikerId,
    teamAPlayerIds,
    teamBPlayerIds,
    tossDecision,
    tossWinnerId,
  } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Login required",
    };

  const uniquePlayers = new Set([...teamAPlayerIds, ...teamBPlayerIds]);
  if (uniquePlayers.size !== teamAPlayerIds.length + teamBPlayerIds.length) {
    return { error: "Duplicate players detected in playing XI" };
  }

  let inning: Inning, match;
  try {
    match = await db.match.findUnique({
      where: {
        id: matchId,
      },
      select: {
        organizerId: true,
        teamAId: true,
        teamBId: true,
        status: true,
        innings: { select: { id: true } },
        playerLimit: true,
      },
    });

    if (!match)
      return {
        error: "Match not found",
      };

    if (match.status !== "not_started" || match.innings.length > 0) {
      return { error: "Match already started" };
    }

    if (
      teamAPlayerIds.length !== match.playerLimit ||
      teamBPlayerIds.length !== match.playerLimit
    ) {
      return { error: `Each team must have exactly ${match.playerLimit} players` };
    }

    if (match.organizerId !== user.id) {
      return {
        error: "Only match organizer can start the match!",
      };
    }

    const battingTeamId =
      (tossWinnerId === match.teamAId && tossDecision === "BAT") ||
      (tossWinnerId === match.teamBId && tossDecision === "BOWL")
        ? match.teamAId
        : match.teamBId;
    const bowlingTeamId =
      (tossWinnerId === match.teamAId && tossDecision === "BOWL") ||
      (tossWinnerId === match.teamBId && tossDecision === "BAT")
        ? match.teamAId
        : match.teamBId;

    const battingPlayers = battingTeamId === match.teamAId ? teamAPlayerIds : teamBPlayerIds;

    const bowlingPlayers = bowlingTeamId === match.teamAId ? teamAPlayerIds : teamBPlayerIds;

    if (
      battingPlayers.findIndex((pl) => pl.id === strikerId) === -1 ||
      battingPlayers.findIndex((pl) => pl.id === nonStrikerId) === -1
    ) {
      return { error: "Strikers must be from batting team" };
    }

    if (battingPlayers.findIndex((pl) => pl.id === bowlerId) !== -1) {
      return { error: "Bowler cannot be from batting team" };
    }

    if (bowlingPlayers.findIndex((pl) => pl.id === bowlerId) === -1) {
      return { error: "Bowler must be from bowling team" };
    }

    if (strikerId === nonStrikerId) {
      return { error: "Striker and non-striker cannot be the same player" };
    }

    const validPlayers = await db.player.findMany({
      where: {
        id: { in: [...teamAPlayerIds.map((pl) => pl.id), ...teamBPlayerIds.map((pl) => pl.id)] },
      },
      select: {
        id: true,
        teamId: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (validPlayers.length !== teamAPlayerIds.length + teamBPlayerIds.length) {
      return { error: "One or more players do not exist" };
    }

    const playerMap = new Map(
      validPlayers.map((p) => [p.id, { teamId: p.teamId, username: p.user.username }])
    );

    for (const player of teamAPlayerIds) {
      if (playerMap.get(player.id)?.teamId !== match.teamAId)
        return { error: `Player ${playerMap.get(player.id)?.username} is invalid in Team A` };
    }

    for (const player of teamBPlayerIds) {
      if (playerMap.get(player.id)?.teamId !== match.teamBId)
        return { error: `Player ${playerMap.get(player.id)?.username} is invalid in Team B` };
    }

    inning = await db.$transaction(async (tx) => {
      const createdInning = await tx.inning.create({
        data: {
          battingTeamId,
          bowlingTeamId,
          matchId,
          currentBowlerId: bowlerId,
          currentStrikerId: strikerId,
          currentNonStrikerId: nonStrikerId,
          inningNumber: 1,
        },
      });

      await tx.inningBatting.createMany({
        data: battingPlayers.map((player) => ({
          playerId: player.id,
          inningId: createdInning.id,
        })),
      });

      await tx.inningBowling.createMany({
        data: bowlingPlayers.map((player) => ({
          playerId: player.id,
          inningId: createdInning.id,
        })),
      });

      await tx.match.update({
        where: { id: matchId },
        data: {
          status: "in_progress",
          tossWinner: tossWinnerId,
          tossDecision,
        },
      });

      return createdInning;
    });

    const foundInning = await db.inning.findUnique({
      where: {
        id: inning.id,
      },
      include: {
        battingTeam: true,
        bowlingTeam: true,
        InningBatting: true,
        InningBowling: true,
        currentBowler: true,
        currentNonStriker: true,
        currentStriker: true,
      },
    });

    if (!foundInning)
      return {
        error: "Inning not found",
      };

    revalidatePath(`/matches/${matchId}`);
    return {
      data: foundInning,
    };
  } catch (error) {
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }
};

export const createMatch = createSafeAction(CreateMatch, createMatchHandler);
export const addOfficials = createSafeAction(AddOfficials, addOfficialsHandler);
export const removeOfficial = createSafeAction(RemoveOfficial, removeOfficialHandler);
export const declineMatchRequest = createSafeAction(Request, declineMatchRequestHandler);
export const acceptMatchRequest = createSafeAction(Request, acceptMatchRequestHandler);
export const initializeMatch = createSafeAction(InitializeMatch, initializeMatchHandler);
