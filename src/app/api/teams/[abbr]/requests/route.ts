import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ abbr: string }> }) {
  const { abbr } = await params;

  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(403, "User not found!"));

  try {
    const team = await db.team.findUnique({
      where: { abbreviation: abbr },
    });

    if (!team) return NextResponse.json(new ApiError(404, "Team not found!"));

    const requests = await db.teamRequest.findMany({
      where: {
        toId: team.ownerId,
        teamId: team.id,
      },
      include: {
        from: true,
      },
    });

    return NextResponse.json(new ApiResponse(requests, 200));
  } catch (error) {
    return NextResponse.error();
  }
}
