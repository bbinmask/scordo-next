"use server";

import { db } from "@/lib/db";
import {
  InputType,
  ReturnTypeForTeams,
  ReturnTypeForTournaments,
  ReturnTypeForUsers,
} from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { Query } from "./schema";
import { currentUser } from "@/lib/currentUser";
import ApiError from "http-errors";

export const searchForTeams = async (data: InputType): Promise<ReturnTypeForTeams> => {
  const { query } = data;
  console.log(query);
  let teams;
  try {
    teams = await db.team.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
        abbreviation: true,
        _count: {
          select: { players: true },
        },
      },
      take: 20,
    });
  } catch (error: any) {
    return {
      error: error.message || "Teams not found",
    };
  }

  return { data: teams };
};

export const searchForTournaments = async (data: InputType): Promise<ReturnTypeForTournaments> => {
  const { query } = data;
  console.log(query);

  let tournaments;
  try {
    tournaments = await db.tournament.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        details: true,
        description: true,
        startDate: true,
        endDate: true,
        organizer: {
          select: { name: true },
        },
        _count: {
          select: { participatingTeams: true },
        },
      },
      take: 20,
    });
  } catch (error: any) {
    return {
      error: error.message || "Teams not found",
    };
  }

  return { data: tournaments };
};

export const searchForUsers = async (data: InputType): Promise<ReturnTypeForUsers> => {
  const { query } = data;
  console.log(query);

  const loggedInUser = await currentUser();

  if (!loggedInUser) return { error: ApiError.Unauthorized.toString() };

  let users;
  try {
    users = await db.user.findMany({
      where: {
        id: {
          not: loggedInUser.id,
        },
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
      take: 15,
    });
  } catch (error: any) {
    return {
      error: error.message || "Teams not found",
    };
  }

  return { data: users };
};

export const searchTeams = createSafeAction(Query, searchForTeams);
export const searchTournaments = createSafeAction(Query, searchForTournaments);
export const searchUsers = createSafeAction(Query, searchForUsers);
