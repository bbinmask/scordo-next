"use server";

import { db } from "@/lib/db";
import {
  InputTypeForCreate,
  InputTypeForOfficials,
  InputTypeForRemove,
  ReturnTypeForCreate,
  ReturnTypeForOfficials,
  ReturnTypeForRemove,
} from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { AddOfficials, CreateMatch, RemoveOfficial } from "./schema";
import { currentUser } from "@/lib/currentUser";
import { ERROR_CODES } from "@/constants";
import { Match } from "@/generated/prisma";
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
        playerLimit: 0,
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

export const createMatch = createSafeAction(CreateMatch, createMatchHandler);
export const addOfficials = createSafeAction(AddOfficials, addOfficialsHandler);
export const removeOfficial = createSafeAction(RemoveOfficial, removeOfficialHandler);
