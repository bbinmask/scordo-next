import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const startOfDayUTC = new Date(Date.UTC(year, month, day, 0, 0, 0));
    const endOfDayUTC = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

    const nextMatch = await db.match.findFirst({
      where: {
        date: {
          gte: startOfDayUTC,
          lte: endOfDayUTC,
        },
        OR: [
          { teamA: { players: { some: { userId: user.id } } } },
          { teamB: { players: { some: { userId: user.id } } } },
        ],
      },
      include: {
        teamA: true,
        teamB: true,
      },
      orderBy: { date: "asc" },
    });

    console.log({ nextMatch });

    if (!nextMatch) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    return NextResponse.json(new ApiResponse(nextMatch));
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
