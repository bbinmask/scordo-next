import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import ApiError from "http-errors";
import { db } from "@/lib/db";
export const GET = async (req: NextRequest) => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return NextResponse.json(ApiError.Unauthorized());

    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      include: {
        teamsOwned: {
          select: {
            matchesAsTeamA: true,
            matchesAsTeamB: true,
          },
        },
        players: {
          select: {
            team: {
              select: {
                players: {
                  select: {
                    user: {},
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {}
};
