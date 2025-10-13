import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  let teams;
  try {
    teams = await db.team.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
        abbreviation: true,
        _count: {
          select: { players: true },
        },
      },
      take: 20,
    });

    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.error();
  }
}
