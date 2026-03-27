"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/currentUser";
import { ERROR_CODES } from "@/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateTournament } from "./schema";
import { Tournament } from "@/generated/prisma";
import { InputTypeForCreate, ReturnTypeForCreate } from "./types";

const createTournamentHandler = async (data: InputTypeForCreate): Promise<ReturnTypeForCreate> => {
  const user = await currentUser();
  if (!user) return { error: ERROR_CODES.UNAUTHORIZED.message };

  const {
    title,
    description,
    totalOvers,
    maxTeams,
    matchesPerTeam,
    minAge,
    maxAge,
    winnerPrice,
    runnerUpPrice,
    entryFee,
    halfBoundary,
    startDate,
    endDate,
    rules,
    location,
  } = data;

  let tournament: Tournament;

  try {
    // const data for now;
    const uniqueTitle = "unique";

    const existing = await db.tournament.findUnique({ where: { uniqueTitle } });
    if (existing) return { error: "A tournament with this title already exists." };
    tournament = await db.tournament.create({
      data: {
        title,
        uniqueTitle,
        description,
        organizerId: user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rules,
        details: {
          totalOvers,
          maxTeams,
          matchesPerTeam,
          minAge: minAge ?? null,
          maxAge: maxAge ?? null,
          winnerPrice: winnerPrice ?? null,
          runnerUpPrice: runnerUpPrice ?? null,
          entryFee: entryFee ?? null,
          halfBoundary,
          location: location ?? null,
        },
      },
    });
  } catch (error: any) {
    return { error: error?.message ?? ERROR_CODES.INTERNAL_SERVER_ERROR.message };
  }

  revalidatePath("/tournaments/my");
  redirect(`/tournaments/${tournament.id}`);
};

export const createTournament = createSafeAction(CreateTournament, createTournamentHandler);
