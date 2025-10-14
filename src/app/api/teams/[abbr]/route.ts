import { db } from "@/lib/db";
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
      },
    });

    console.log(team);

    if (!team) return NextResponse.error();

    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(req: NextRequest) {}
