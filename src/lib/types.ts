import { Prisma } from "@/generated/prisma";

const teamWithPlayerCountAndOwner = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    name: true,
    logo: true,
    banner: true,
    abbreviation: true,
    owner: {
      select: {
        id: true,
        username: true,
      },
    },
    _count: {
      select: { players: true },
    },
  },
});

const friendshipWithBoth = Prisma.validator<Prisma.FriendshipDefaultArgs>()({
  include: {
    requester: true,
    addressee: true,
  },
});

const teamRequestWithDetails = Prisma.validator<Prisma.TeamRequestDefaultArgs>()({
  include: {
    team: true,
    from: true,
  },
});
const tournamentRequestWithDetails = Prisma.validator<Prisma.TournamentRequestDefaultArgs>()({
  include: {
    tournament: true,
  },
});

export type TeamRequestWithDetails = Prisma.TeamRequestGetPayload<typeof teamRequestWithDetails>;

export type TournamentRequestWithDetails = Prisma.TournamentRequestGetPayload<
  typeof tournamentRequestWithDetails
>;

export type FriendshipWithBoth = Prisma.FriendshipGetPayload<typeof friendshipWithBoth>;

export type TeamForListComponent = Prisma.TeamGetPayload<typeof teamWithPlayerCountAndOwner>;

const userWithTeams = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    players: {
      select: {
        team: true,
      },
    },
  },
});

export type UserWithTeamsProps = Prisma.UserGetPayload<typeof userWithTeams>;
