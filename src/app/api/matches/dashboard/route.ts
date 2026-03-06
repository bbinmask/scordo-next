import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const liveMatches = await db.match.findMany({
      where: {
        OR: [{ status: "in_progress" }, { status: "inning_completed" }],
      },
      include: {
        teamA: true,
        teamB: true,
      },
    });

    const upcomingMatches = await db.match.findMany({
      where: {
        status: "not_started",
      },
      include: {
        teamA: true,
        teamB: true,
      },
    });

    return NextResponse.json({ success: true, data: { upcomingMatches, liveMatches } });
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
