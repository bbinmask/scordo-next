import { db } from "@/lib/db";
import ApiError from "http-errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  let tournaments;
  try {
    tournaments = await db.tournament.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        details: true,
        description: true,
        startDate: true,
        endDate: true,
        organizer: {
          select: { name: true },
        },
        _count: {
          select: { participatingTeams: true },
        },
      },
      take: 20,
    });

    return NextResponse.json(tournaments);
  } catch (err) {
    return NextResponse.error();
  }
}
