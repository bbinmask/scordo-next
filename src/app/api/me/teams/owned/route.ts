import { db } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const teams = await db.team.findMany({
      where: {
        OR: [{ captainId: user.id }, { ownerId: user.id }],
      },
      select: {
        id: true,
        name: true,
        players: {
          select: {
            _count: true,
          },
        },
        abbreviation: true,
        logo: true,
      },
    });

    return NextResponse.json(new ApiResponse(teams, 201));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
}
