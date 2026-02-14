import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ inningId: string }> }) => {
  const { inningId } = await params;

  if (!inningId) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

  try {
    const inning = await db.inning.findUnique({
      where: {
        id: inningId,
      },
    });

    if (!inning) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const lastLegalBall = await db.ball.findFirst({
      where: {
        inningId,
        isWide: false,
        isNoBall: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (lastLegalBall) {
      const legalBallsThisOver = await db.ball.count({
        where: {
          inningId,
          over: lastLegalBall.over,
          isWide: false,
          isNoBall: false,
        },
      });

      if (legalBallsThisOver === 6 && inning.currentBowlerId === lastLegalBall.bowlerId)
        return NextResponse.json(new ApiResponse(true));
    }

    return NextResponse.json(new ApiResponse(false));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
