import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    const match = await db.match.findUnique({
      where: {
        id,
      },
      include: {
        teamA: {
          include: {
            players: {
              include: {
                user: true,
              },
            },
          },
        },
        teamB: {
          include: {
            players: {
              include: {
                user: true,
              },
            },
          },
        },
        matchOfficials: true,
        innings: {
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
        },
      },
    });

    if (!match) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    return NextResponse.json(new ApiResponse(match));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
