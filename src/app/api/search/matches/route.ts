import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const matches = await db.match.findMany({
      where: {
        OR: [
          {
            teamA: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            teamA: {
              abbreviation: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            teamB: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            teamB: {
              abbreviation: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        teamA: true,
        teamB: true,
      },
    });

    return NextResponse.json(new ApiResponse(matches));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
