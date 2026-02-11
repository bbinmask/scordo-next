import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ inningId: string }> }) => {
  const { inningId } = await params;

  if (!inningId) return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST));

  try {
    const wicketBalls = await db.ball.findMany({
      where: {
        inningId,
        isWicket: true,
      },
      include: {
        batsman: { include: { user: true } },
        bowler: { include: { user: true } },
        fielder: { include: { user: true } },
      },
    });

    return NextResponse.json(new ApiResponse(wicketBalls));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
