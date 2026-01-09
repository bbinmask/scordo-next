import { db } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
export async function GET(req: NextRequest) {
  const clerkUser = await currentUser();

  if (!clerkUser) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const teams = await db.team.findMany({
      where: {
        OR: [
          {
            players: {
              some: {
                user: {
                  clerkId: clerkUser.id,
                },
              },
            },
          },
          {
            owner: {
              clerkId: clerkUser.id,
            },
          },
        ],
      },
    });

    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      include: {
        teamsOwned: true,
        players: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

    return NextResponse.json(new ApiResponse(user, 201));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
}
