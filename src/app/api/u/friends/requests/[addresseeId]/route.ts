import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ addresseeId: string | null }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { addresseeId } = await params;
    if (!addresseeId) return NextResponse.json({ error: "Missing addresseeId" }, { status: 400 });

    // Users can only view their own friend requests
    if (user.id !== addresseeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requests = await db.friendship.findMany({
      where: {
        addresseeId,
        status: "PENDING",
      },
      select: {
        addressee: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
        requesterId: true,
        requester: {
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

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
