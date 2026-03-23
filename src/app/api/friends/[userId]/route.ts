import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ userId?: string }> }) {
  const { userId } = await params;
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
