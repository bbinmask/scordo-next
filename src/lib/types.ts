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
