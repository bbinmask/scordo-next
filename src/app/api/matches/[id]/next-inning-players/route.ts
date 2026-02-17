import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  if (!id) return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST));

  try {
    const match = await db.match.findUnique({
      where: {
        id,
      },
      include: {
        innings: {
          include: {
            InningBatting: true,
            InningBowling: true,
          },
        },
      },
    });

    if (!match) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const lastBatted = match.innings.at(-1)?.battingTeamId === match.teamAId ? "teamA" : "teamB";

    const inningId = match.innings.at(-1)?.id as string;

    let battingPlayers = await db.inningBatting.findMany({
      where: {
        id: {
          in: match.innings[0].InningBatting.map((pl) => pl.id),
        },
        inningId,
      },
      include: {
        player: {
          include: {
            user: true,
          },
        },
      },
    });

    let bowlingPlayers = await db.inningBowling.findMany({
      where: {
        id: {
          in: match.innings[0].InningBowling.map((pl) => pl.id),
        },
        inningId,
      },
      include: {
        player: {
          include: {
            user: true,
          },
        },
      },
    });

    if (lastBatted === "teamA") {
      const temp = battingPlayers;
      battingPlayers = bowlingPlayers as any;
      bowlingPlayers = temp as any;
    }
    return NextResponse.json(new ApiResponse({ battingPlayers, bowlingPlayers }));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
