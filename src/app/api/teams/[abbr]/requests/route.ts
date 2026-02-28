import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ abbr: string }> }) {
  const { abbr } = await params;

  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const team = await db.team.findUnique({
      where: { abbreviation: abbr },
    });

    if (!team) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const requests = await db.teamRequest.findMany({
      where: {
        fromId: team.ownerId,
        isInvite: false,
        teamId: team.id,
        status: "pending",
      },
      include: {
        to: true,
        team: true,
      },
    });

    return NextResponse.json(new ApiResponse(requests));
  } catch (error) {
    return NextResponse.error();
  }
}
