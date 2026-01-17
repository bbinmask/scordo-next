import { ERROR_CODES, user } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { abbr: string } }) => {
  const { abbr } = params;

  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  console.log({ abbr });

  try {
    const team = await db.team.findUnique({
      where: {
        abbreviation: abbr,
      },
    });

    if (!team) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const request = await db.teamRequest.findFirst({
      where: {
        teamId: team.id,
        fromId: user.id,
      },

      select: {
        status: true,
        id: true,
      },
    });

    return NextResponse.json(new ApiResponse(request));
  } catch (error) {
    return NextResponse.error();
  }
};
