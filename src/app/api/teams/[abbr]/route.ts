import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ abbr: string }> }) {
  const { abbr } = await params;

  try {
    if (!abbr) return NextResponse.error();

    const team = await db.team.findFirst({
      where: {
        abbreviation: abbr,
      },
      include: {
        owner: true,
        players: {
          select: {
            user: {
              select: {
                username: true,
                name: true,
              },
            },
          },
        },
        captain: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    if (!team) return NextResponse.json(new ApiError(404, "Team not found!"));

    return NextResponse.json(new ApiResponse(team, 200, "Team found"));
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(req: NextRequest) {}
