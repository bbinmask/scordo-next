import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
import { NextResponse } from "next/server";

/**
 * GET /api/tournaments/leaderboard?tournamentId=<id>
 *
 * Returns all leaderboard categories for a tournament:
 *  - mostRuns        (top batters by total runs)
 *  - mostWickets     (top bowlers by total wickets)
 *  - mostSixes       (top batters by sixes)
 *  - mostFours       (top batters by fours)
 *  - highestScores   (individual innings scores, best first)
 *  - bestBowling     (individual innings bowling figures, best first)
 */
export const GET = async (req: Request) => {
  const user = await currentUser();
  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED), { status: 401 });

  const tournamentId = new URL(req.url).searchParams.get("tournamentId");
  if (!tournamentId)
    return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST), { status: 400 });

  try {
    // Verify tournament exists
    const tournament = await db.tournament.findUnique({
      where: { id: tournamentId },
      select: { id: true, title: true },
    });
    if (!tournament)
      return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND), { status: 404 });

    // Fetch all batting records for this tournament's matches
    const battingRecords = await db.inningBatting.findMany({
      where: {
        inning: {
          match: { tournamentId },
        },
      },
      include: {
        player: {
          include: {
            user: { select: { name: true, username: true, avatar: true } },
            team: { select: { name: true, abbreviation: true, logo: true } },
          },
        },
      },
    });

    // Fetch all bowling records for this tournament's matches
    const bowlingRecords = await db.inningBowling.findMany({
      where: {
        inning: {
          match: { tournamentId },
        },
      },
      include: {
        player: {
          include: {
            user: { select: { name: true, username: true, avatar: true } },
            team: { select: { name: true, abbreviation: true, logo: true } },
          },
        },
      },
    });

    // ── Aggregate batting by player ──────────────────────────────────────────
    type BatAgg = {
      userId: string;
      name: string;
      username: string;
      avatar: string | null;
      teamName: string;
      teamAbbr: string;
      teamLogo: string | null;
      runs: number;
      sixes: number;
      fours: number;
      balls: number;
      innings: number;
      highScore: number;
      notOuts: number;
    };

    const batMap = new Map<string, BatAgg>();

    for (const r of battingRecords) {
      const key = r.player.userId;
      const existing = batMap.get(key);
      if (!existing) {
        batMap.set(key, {
          userId: r.player.userId,
          name: r.player.user.name,
          username: r.player.user.username,
          avatar: r.player.user.avatar,
          teamName: r.player.team.name,
          teamAbbr: r.player.team.abbreviation,
          teamLogo: r.player.team.logo,
          runs: r.runs,
          sixes: r.sixes,
          fours: r.fours,
          balls: r.balls,
          innings: 1,
          highScore: r.runs,
          notOuts: r.isOut ? 0 : 1,
        });
      } else {
        existing.runs += r.runs;
        existing.sixes += r.sixes;
        existing.fours += r.fours;
        existing.balls += r.balls;
        existing.innings += 1;
        existing.highScore = Math.max(existing.highScore, r.runs);
        if (!r.isOut) existing.notOuts += 1;
      }
    }

    const batAgg = Array.from(batMap.values()).map((p) => ({
      ...p,
      avg:
        p.innings - p.notOuts > 0
          ? (p.runs / (p.innings - p.notOuts)).toFixed(2)
          : p.runs.toFixed(2),
      sr: p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : "0.0",
    }));

    // ── Aggregate bowling by player ──────────────────────────────────────────
    type BowlAgg = {
      userId: string;
      name: string;
      username: string;
      avatar: string | null;
      teamName: string;
      teamAbbr: string;
      teamLogo: string | null;
      wickets: number;
      runs: number;
      overs: number;
      balls: number;
      maidens: number;
      innings: number;
      bestWickets: number;
      bestRuns: number;
    };

    const bowlMap = new Map<string, BowlAgg>();

    for (const r of bowlingRecords) {
      const key = r.player.userId;
      const existing = bowlMap.get(key);
      if (!existing) {
        bowlMap.set(key, {
          userId: r.player.userId,
          name: r.player.user.name,
          username: r.player.user.username,
          avatar: r.player.user.avatar,
          teamName: r.player.team.name,
          teamAbbr: r.player.team.abbreviation,
          teamLogo: r.player.team.logo,
          wickets: r.wickets,
          runs: r.runs,
          overs: r.overs,
          balls: r.overs * 6 + r.balls,
          maidens: r.maidens,
          innings: 1,
          bestWickets: r.wickets,
          bestRuns: r.runs,
        });
      } else {
        existing.wickets += r.wickets;
        existing.runs += r.runs;
        existing.overs += r.overs;
        existing.balls += r.overs * 6 + r.balls;
        existing.maidens += r.maidens;
        existing.innings += 1;
        // Best bowling = most wickets; fewest runs as tiebreaker
        if (
          r.wickets > existing.bestWickets ||
          (r.wickets === existing.bestWickets && r.runs < existing.bestRuns)
        ) {
          existing.bestWickets = r.wickets;
          existing.bestRuns = r.runs;
        }
      }
    }

    const bowlAgg = Array.from(bowlMap.values()).map((p) => ({
      ...p,
      bbi: `${p.bestWickets}/${p.bestRuns}`,
      econ: p.balls > 0 ? ((p.runs / p.balls) * 6).toFixed(2) : "0.00",
      avg: p.wickets > 0 ? (p.runs / p.wickets).toFixed(2) : "-",
    }));

    // ── Individual highest scores (per innings) ──────────────────────────────
    const highestScores = battingRecords
      .map((r) => ({
        userId: r.player.userId,
        name: r.player.user.name,
        username: r.player.user.username,
        avatar: r.player.user.avatar,
        teamName: r.player.team.name,
        teamAbbr: r.player.team.abbreviation,
        runs: r.runs,
        balls: r.balls,
        fours: r.fours,
        sixes: r.sixes,
        isOut: r.isOut,
        sr: r.balls > 0 ? ((r.runs / r.balls) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 20);

    // ── Best bowling figures (per innings) ───────────────────────────────────
    const bestBowling = bowlingRecords
      .map((r) => ({
        userId: r.player.userId,
        name: r.player.user.name,
        username: r.player.user.username,
        avatar: r.player.user.avatar,
        teamName: r.player.team.name,
        teamAbbr: r.player.team.abbreviation,
        wickets: r.wickets,
        runs: r.runs,
        overs: r.overs,
        balls: r.balls,
        figure: `${r.wickets}/${r.runs}`,
        econ:
          r.overs * 6 + r.balls > 0
            ? ((r.runs / (r.overs * 6 + r.balls)) * 6).toFixed(2)
            : "0.00",
      }))
      .sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)
      .slice(0, 20);

    return NextResponse.json(
      new ApiResponse(
        {
          mostRuns: batAgg.sort((a, b) => b.runs - a.runs).slice(0, 20),
          mostWickets: bowlAgg.sort((a, b) => b.wickets - a.wickets).slice(0, 20),
          mostSixes: batAgg.sort((a, b) => b.sixes - a.sixes).slice(0, 20),
          mostFours: batAgg.sort((a, b) => b.fours - a.fours).slice(0, 20),
          highestScores,
          bestBowling,
        },
        200
      )
    );
  } catch (error) {
    console.error("[tournaments/leaderboard]", error);
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
