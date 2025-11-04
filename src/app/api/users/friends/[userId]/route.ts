import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ userId?: string }> }) {
  const { userId } = await params;
  try {
    console.log(userId);
    if (!userId) return NextResponse.error();

    const friends = await db.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ addresseeId: userId }, { requesterId: userId }],
      },
      include: {
        addressee: {
          select: {
            name: true,
            username: true,
            id: true,
            avatar: true,
          },
        },
        requester: {
          select: {
            name: true,
            username: true,
            id: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(friends);
  } catch (error) {
    return NextResponse.error();
  }
}
