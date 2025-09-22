import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import ApiError from "http-errors";
export const GET = async (req: NextRequest) => {
  const clerkUser = await currentUser();

  if (!clerkUser) return NextResponse.json(ApiError.Unauthorized());
};
