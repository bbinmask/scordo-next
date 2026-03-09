import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const params = new URL(req.url).searchParams;
  const userId = params.get("userId");

  if (!userId) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND), { status: 400 });

  try {
    const battingRecords = await db.inningBatting.findMany({
      where: {
        player: {
          userId,
        },
      },
    });

    return NextResponse.json(new ApiResponse(battingRecords));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
