import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ abbr: string }> }) {
  const { abbr } = await params;

  const user = await currentUser();

  if (!user) return;

  const searchParams = req.nextUrl.search;

  const teamOwner = searchParams.split("=")[1];

  if (teamOwner !== user.id) return;

  try {
    const requests = await db.teamRequest.findMany({
      where: {
        team: {
          ownerId: teamOwner,
        },
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
