import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const activeTournaments = await db.tournament.findMany({
      where: {
        status: "NOT_STARTED",
      },
      include: {
        _count: {
          select: {
            participatingTeams: true,
          },
        },
        matches: true,
        requests: true,
        participatingTeams: true,
        tournamentOfficials: true,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(new ApiResponse(activeTournaments), { status: 200 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
