import { ERROR_CODES } from "@/constants";
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
                avatar: true,
              },
            },
            userId: true,
          },
        },
        captain: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
      },
    });

    if (!team) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    return NextResponse.json(new ApiResponse(team, 200, "Team found"));
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(req: NextRequest) {}
