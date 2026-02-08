import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const matches = await db.match.findMany({
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

    return NextResponse.json(new ApiResponse(matches));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
