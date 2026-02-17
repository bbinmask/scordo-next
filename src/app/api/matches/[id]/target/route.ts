import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  if (!id) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

  try {
    const match = await db.match.findUnique({
      where: {
        id,
      },
      select: {
        innings: {
          select: {
            inningNumber: true,
            runs: true,
            balls: true,
            wickets: true,
          },
        },
        overs: true,
      },
    });

    if (!match) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    if (match.innings.length === 2) {
      const firstInningRuns = match.innings[0].runs;
      const secondInningRuns = match.innings[1].runs;
      const ballsLeft = match.overs * 6 - match.innings[1].balls;

      return NextResponse.json(
        new ApiResponse(
          `${firstInningRuns + 1 - secondInningRuns} runs required in ${ballsLeft} balls`
        )
      );
    }

    return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
