"use server";

import { db } from "@/lib/db";
import { InputTypeForCreate, ReturnTypeForCreate } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateMatch } from "./schema";
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
        date,
        location,
        overLimit,
        overs,
        teamAId,
        teamBId,
        tossDecision,
        tossWinner,
        venue,
        ...(tournamentId && { tournamentId }),
      },
    });

    if (!match)
      return {
        error: "Could not create match!",
      };

    matchOfficial = await db.matchOfficial.createMany({
      data: matchOfficials?.map((official: any) => ({
        ...official,
        matchId: match.id,
      })),
    });
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

export const createMatch = createSafeAction(CreateMatch, createMatchHandler);
