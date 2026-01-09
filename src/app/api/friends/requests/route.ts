import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/constants";
export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

  try {
    const requests = await db.friendship.findMany({
      where: {
        OR: [{ addresseeId: user.id }, { requesterId: user.id }],
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
        addresseeId: true,
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
    return NextResponse.error();
  }
}
