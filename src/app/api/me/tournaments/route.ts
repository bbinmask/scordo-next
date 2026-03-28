import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await currentUser();
  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED), { status: 401 });

  try {
    const tournaments = await db.tournament.findMany({
      where: {
        NOT: { organizerId: user.id },
        participatingTeams: {
          some: {
            team: {
              players: { some: { userId: user.id } },
            },
          },
        },
      },
      include: {
        organizer: { select: { name: true, username: true } },
        _count: { select: { participatingTeams: true, matches: true } },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(new ApiResponse(tournaments, 200));
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
