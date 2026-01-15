import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const teamInvitations = await db.teamRequest.findMany({
      where: {
        fromId: user.id,
      },
      include: {
        team: true,
        from: true,
      },
    });

    return NextResponse.json(new ApiResponse(teamInvitations));
  } catch (error) {
    return NextResponse.error();
  }
};
