import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import ApiError from "http-errors";
import { db } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
export const GET = async (req: NextRequest) => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return NextResponse.json(ApiError.Unauthorized());

    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      include: {
        players: {
          select: {
            team: true,
          },
        },
      },
    });

    if (!user) return NextResponse.json(ApiError.NotFound("User not found"));

    return NextResponse.json({ user, success: true, status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(ApiError.InternalServerError("Something went wrong"));
  }
};
