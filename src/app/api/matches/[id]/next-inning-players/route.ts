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

    const inningId = match.innings.at(-1)?.id as string;

    const nextBowlingPlayers = await db.inningBatting.findMany({
      where: {
        inningId,
      },
      select: {
        player: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
                id: true,
              },
            },
            userId: true,
          },
        },
        playerId: true,
      },
    });

    const nextBattingPlayers = await db.inningBowling.findMany({
      where: {
        inningId,
      },
      select: {
        player: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
                id: true,
              },
            },
            userId: true,
          },
        },
        playerId: true,
      },
    });

    return NextResponse.json(new ApiResponse({ nextBattingPlayers, nextBowlingPlayers }));
  } catch {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
