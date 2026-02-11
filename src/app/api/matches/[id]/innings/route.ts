import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  if (!id) return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST));

  try {
    const innings = await db.inning.findMany({
      where: {
        matchId: id,
      },
      include: {
        ballsData: true,
        battingTeam: true,
        bowlingTeam: true,
        currentBowler: {
          include: {
            ballsBowled: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        currentNonStriker: {
          include: {
            ballsBatted: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        currentStriker: {
          include: {
            ballsBatted: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        InningBatting: {
          include: {
            player: {
              select: {
                user: {
                  select: {
                    name: true,
                    username: true,
                  },
                },
                userId: true,
              },
            },
          },
        },
        InningBowling: {
          include: {
            player: {
              select: {
                user: {
                  select: {
                    name: true,
                    username: true,
                  },
                },
                userId: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(new ApiResponse(innings));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
