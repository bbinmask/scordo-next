import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    const match = await db.match.findUnique({
      where: {
        id,
      },
      include: {
        teamA: {
          include: {
            players: {
              include: {
                user: true,
              },
            },
          },
        },
        teamB: {
          include: {
            players: {
              include: {
                user: true,
              },
            },
          },
        },
        matchOfficials: true,
      },
    });

    console.log({ match });

    if (!match) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    return NextResponse.json(new ApiResponse(match));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
