import { ERROR_CODES } from "@/constants";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ userId?: string }> }) {
  const { userId } = await params;
  if (!userId) return NextResponse.error();

  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED));

  try {
    const friendship = await db.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: userId,
            addresseeId: user.id,
          },
          {
            requesterId: user.id,
            addresseeId: userId,
          },
        ],
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
