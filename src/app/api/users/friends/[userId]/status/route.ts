import { db } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ userId?: string }> }) {
  const { userId } = await params;
  try {
    if (!userId) return NextResponse.error();

    const friends = await db.friendship.findFirst({
      where: {
        OR: [{ addresseeId: userId }, { requesterId: userId }],
      },
      select: {
        status: true,
      },
    });

    if (!friends) {
      return NextResponse.json(new ApiResponse({ status: "none" }, 200));
    }

    return NextResponse.json(new ApiResponse(friends, 201));
  } catch (error) {
    return NextResponse.error();
  }
}
