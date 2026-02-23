import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiResponse, ApiError } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
export const GET = async (req: NextRequest) => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      include: {
        players: {
          select: {
            team: true,
          },
        },
      },
    });

    if (!user) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    return NextResponse.json(new ApiResponse(user));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
