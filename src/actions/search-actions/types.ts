import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { Query } from "./schema";

import { Prisma } from "@/generated/prisma";

const teamSearchResultValidator = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    name: true,
    logo: true,
    abbreviation: true,
    _count: {
      select: { players: true },
    },
  },
});

const tournamentSearchResultValidator = Prisma.validator<Prisma.TournamentDefaultArgs>()({
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
});

const userSearchResultValidator = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
    username: true,
    avatar: true,
  },
});

export type UserSearchResult = Prisma.UserGetPayload<typeof userSearchResultValidator>;

type TournamentSearchResult = Prisma.TournamentGetPayload<typeof tournamentSearchResultValidator>;

type TeamSearchResult = Prisma.TeamGetPayload<typeof teamSearchResultValidator>;

export type InputType = z.infer<typeof Query>;
export type ReturnTypeForUsers = ActionState<InputType, UserSearchResult[]>;
export type ReturnTypeForTeams = ActionState<InputType, TeamSearchResult[]>;
export type ReturnTypeForTournaments = ActionState<InputType, TournamentSearchResult[]>;
