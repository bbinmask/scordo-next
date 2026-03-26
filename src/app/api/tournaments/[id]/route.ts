import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
import { NextResponse } from "next/server";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = await currentUser();
  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED), { status: 401 });

  const { id } = await params;

  try {
    const tournament = await db.tournament.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        participatingTeams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                abbreviation: true,
                logo: true,
                _count: { select: { players: true } },
              },
            },
          },
        },
        matches: {
          include: {
            teamA: { select: { id: true, name: true, abbreviation: true, logo: true } },
            teamB: { select: { id: true, name: true, abbreviation: true, logo: true } },
          },
          orderBy: { date: "desc" },
        },
        _count: {
          select: { participatingTeams: true, matches: true },
        },
      },
    });

    if (!tournament)
      return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND), { status: 404 });

    return NextResponse.json(new ApiResponse(tournament, 200));
  } catch (error) {
    console.error("[tournaments/[id]]", error);
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
