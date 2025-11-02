import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) return NextResponse.error();

    const friends = await db.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ addresseeId: user.id }, { requesterId: user.id }],
      },
      include: {
        addressee: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
        requester: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
      },
    });

    return NextResponse.json(friends);
  } catch (error) {
    return NextResponse.error();
  }
}
