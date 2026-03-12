import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const params = new URL(req.url).searchParams;
  const teamId = params.get("teamId");

  if (!teamId) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND), { status: 400 });

  try {
    const inningsBatted = await db.inning.findMany({
      where: {
        battingTeamId: teamId,
      },
      select: {
        id: true,
        overs: true,
        runs: true,
        wickets: true,
        inningNumber: true,
      },
    });

    const inningsBowled = await db.inning.findMany({
      where: {
        bowlingTeamId: teamId,
      },
      select: {
        overs: true,
        runs: true,
        wickets: true,
        inningNumber: true,
      },
    });

    const inningBatting = await db.inningBatting.findMany({
      where: {
        inning: {
          battingTeamId: teamId,
        },
      },
    });

    const inningBowling = await db.inningBowling.findMany({
      where: {
        inning: {
          bowlingTeamId: teamId,
        },
      },
    });

    const allBattingStats = inningBatting.reduce(
      (acc, curr) => {
        acc.runs += curr.runs;
        acc.balls += curr.balls;
        acc.fours += curr.fours;
        acc.sixes += curr.sixes;
        acc.dots += curr.dots;

        return acc;
      },
      {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        dots: 0,
      }
    );

    const allBowlingStats = inningBowling.reduce(
      (acc, curr) => {
        acc.balls += curr.balls;
        acc.maidens += curr.maidens;
        acc.noBalls += curr.noBalls;
        acc.overs += curr.overs;
        acc.runs += curr.runs;
        acc.wickets += curr.wickets;

        return acc;
      },
      {
        balls: 0,
        maidens: 0,
        noBalls: 0,
        overs: 0,
        runs: 0,
        wickets: 0,
      }
    );

    const matchResults = await db.match.findMany({
      where: {
        OR: [{ teamAId: teamId }, { teamBId: teamId }],
        result: {
          not: null,
        },
      },
      select: {
        teamAId: true,
        teamBId: true,
        winnerId: true,
        result: true,
      },
    });

    const results = matchResults.map((match) => {
      if (!match.winnerId) return "D";
      if (match.winnerId === teamId) return "W";
      return "L";
    });

    return NextResponse.json(
      new ApiResponse({ inningsBatted, inningsBowled, allBattingStats, allBowlingStats, results })
    );
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
