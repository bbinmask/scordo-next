import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ username: string }>;
}

export async function GET(req: Request, { params }: Params) {
  const { username } = await params;

  try {
    if (!username || username.trim() === "")
      return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST));

    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}
