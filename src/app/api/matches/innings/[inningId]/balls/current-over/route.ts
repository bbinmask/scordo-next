import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ inningId: string }> }) => {
  const { inningId } = await params;

  if (!inningId) return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST));

  try {
    const inning = await db.inning.findUnique({
      where: { id: inningId },
    });

    if (!inning) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const currentOver = await db.ball.findMany({
      where: {
        inningId,
        bowlerId: inning.currentBowlerId as string,
        over: inning.overs,
      },
      select: {
        runs: true,
        ball: true,
        id: true,
        isBye: true,
        isLegBye: true,
        isNoBall: true,
        isWicket: true,
        isWide: true,
      },
    });

    return NextResponse.json(new ApiResponse(currentOver));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
