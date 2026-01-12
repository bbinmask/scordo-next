import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = await params;

  if (!id) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const teams = await db.team.findMany({
      where: {
        OR: [{ ownerId: user.id }, { captainId: user.id }],
      },
      select: {
        id: true,
      },
    });

    const teamIds = teams.map((t) => t.id);

    const requests = await db.teamRequest.findMany({
      where: {
        teamId: {
          in: teamIds,
        },
      },
    });

    return NextResponse.json(new ApiResponse(requests));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
