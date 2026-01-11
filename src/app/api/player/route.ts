import { db } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const players = await db.player.findMany({
      select: {
        user: true,
        team: true,
      },
    });

    return NextResponse.json(new ApiResponse(players, 200));
  } catch (error) {}
};
