import { Prisma } from "@/generated/prisma";

const teamWithPlayerCountAndOwner = Prisma.validator<Prisma.TeamDefaultArgs>()({
  include: {
    owner: {
      select: {
        id: true,
        username: true,
        name: true,
      },
    },
    _count: {
      select: { players: true },
    },
  },
});
const teamWithPlayers = Prisma.validator<Prisma.TeamDefaultArgs>()({
  include: {
    owner: {
      select: {
        id: true,
        username: true,
        name: true,
      },
    },
    players: {
      include: {
        user: true,
        _count: true,
      },
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

const playerWithUser = Prisma.validator<Prisma.PlayerDefaultArgs>()({
  include: {
    user: true,
  },
});

const matchWithTeamsAndOfficials = Prisma.validator<Prisma.MatchDefaultArgs>()({
  include: {
    teamA: true,
    teamB: true,
    matchOfficials: true,
  },
});

const inningDetails = Prisma.validator<Prisma.InningDefaultArgs>()({
  include: {
    ballsData: true,
    battingTeam: true,
    bowlingTeam: true,
    currentBowler: true,
    currentNonStriker: true,
    currentStriker: true,
    InningBatting: true,
    InningBowling: true,
  },
});

export type InningDetails = Prisma.InningGetPayload<typeof inningDetails>;
export type MatchWithTeamAndOfficials = Prisma.MatchGetPayload<typeof matchWithTeamsAndOfficials>;

export type TeamRequestWithDetails = Prisma.TeamRequestGetPayload<typeof teamRequestWithDetails>;

export type TournamentRequestWithDetails = Prisma.TournamentRequestGetPayload<
  typeof tournamentRequestWithDetails
>;

export type FriendshipWithBoth = Prisma.FriendshipGetPayload<typeof friendshipWithBoth>;

export type TeamWithPlayers = Prisma.TeamGetPayload<typeof teamWithPlayers>;

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

export type PlayerWithUser = Prisma.PlayerGetPayload<typeof playerWithUser>;
