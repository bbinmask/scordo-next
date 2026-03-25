import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
import { ExploreResultsProps } from "@/types/index.props";

export const GET = async (req: NextRequest) => {
  try {
    let results: ExploreResultsProps = {
      teams: [],
      matches: [],
      users: [],
      tournaments: [],
    };

    const teams = await db.team.findMany({
      take: 5,
      include: {
        players: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedTeams = teams.map((team) => ({
      id: team.id,
      type: "teams" as any,
      href: `/teams/${team.abbreviation}`,
      short: team.abbreviation,
      title: team.name,
      subtitle: `${team.players.length} players`,
      image: team.logo,
      meta: "Team",
      trending: team.players.length > 8,
    }));

    results.teams = mappedTeams;

    const matches = await db.match.findMany({
      take: 5,
      include: {
        teamA: true,
        teamB: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const mappedMatches = matches.map((match) => ({
      id: match.id,
      type: "matches" as any,
      href: `/matches/${match.id}`,
      title: `${match.teamA.abbreviation} vs ${match.teamB.abbreviation}`,
      subtitle: match.date
        ? new Date(match.date).toDateString()
        : `Match is in ${match.venue.city}(${match.venue.state})`,
      meta: "Match",
      status: match.status ? "Live" : "Upcoming",
      badge: match.result || null,
    }));

    results.matches = mappedMatches;

    const users = await db.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedUsers = users.map((user) => ({
      id: user.id,
      type: "users" as any,
      href: `/u/${user.username}`,
      title: user.name,
      subtitle: user.email,
      image: user.avatar,
      meta: "Player",
    }));

    results.users = mappedUsers;

    const tournaments = await db.tournament.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedTournaments = tournaments.map((tournament) => ({
      id: tournament.id,
      type: "tournaments" as any,
      title: tournament.title,
      href: `/tournaments/${tournament.id}`,
      subtitle: `${tournament.details.location?.city}(${tournament.details.location?.state})`,
      meta: "Tournament",
      badge: `₹${tournament.details.entryFee}`,
    }));

    results.tournaments = mappedTournaments;

    return NextResponse.json(new ApiResponse(results));
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
