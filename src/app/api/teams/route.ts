import { db } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async () => {
  const teams = await db.team.findMany({
    include: {
      captain: true,
      owner: true,
    },
  });

  return NextResponse.json(new ApiResponse(teams));
};
