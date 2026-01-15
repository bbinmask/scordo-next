import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const teams = await db.team.findMany({
      where: {
        players: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(new ApiResponse(teams, 201));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
}
