import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED), { status: 401 });

  try {
    const friendReqs = await db.friendship.findMany({
      where: {
        addresseeId: user.id,
        status: "PENDING",
      },
      include: {
        requester: true,
        addressee: true,
      },
    });

    const teamRequests = await db.teamRequest.findMany({
      where: {
        toId: user.id,
        isInvite: true,
      },
      include: {
        team: true,
        to: true,
      },
    });

    const tournamentRequests = await db.tournamentRequest.findMany({
      where: {
        AND: [
          { status: "pending" },
          {
            team: {
              ownerId: user.id,
            },
          },
        ],
      },
      include: {
        tournament: true,
        team: true,
      },
    });

    const matchRequests = await db.match.findMany({
      where: {
        teamB: {
          OR: [{ ownerId: user.id }, { captainId: user.id }],
        },
        requestStatus: "pending",
      },
      select: {
        id: true,
        teamA: {
          select: {
            name: true,
            abbreviation: true,
            logo: true,
          },
        },
      },
    });

    return NextResponse.json(
      new ApiResponse({
        friendReqs,
        teamRequests,
        tournamentRequests,
        matchRequests,
        userId: user.id,
      })
    );
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
