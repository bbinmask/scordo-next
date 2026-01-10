import { db } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ userId?: string }> }) {
  const { userId } = await params;
  try {
    if (!userId) return NextResponse.error();

    const friendship = await db.friendship.findFirst({
      where: {
        OR: [{ addresseeId: userId }, { requesterId: userId }],
      },
      select: {
        status: true,
        addressee: {
          select: { name: true },
        },
        requester: { select: { name: true } },
        addresseeId: true,
        requesterId: true,
        id: true,
      },
    });

    if (!friendship) {
      return NextResponse.json(new ApiResponse({ status: "none" }, 200));
    }

    if (friendship.requesterId === userId && friendship.status === "PENDING")
      return NextResponse.json(new ApiResponse({ status: "recieved", id: friendship.id }));

    return NextResponse.json(new ApiResponse(friendship, 201));
  } catch (error) {
    return NextResponse.error();
  }
}
