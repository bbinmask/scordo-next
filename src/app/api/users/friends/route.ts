import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { requesterId }: { requesterId?: string } = await req.json();

    if (!requesterId) return NextResponse.error();

    const friends = db.friendship.findMany({
      where: {
        requesterId,
        status: "ACCEPTED",
      },
      select: {
        addressee: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(friends);
  } catch (error) {
    return NextResponse.error();
  }
}
