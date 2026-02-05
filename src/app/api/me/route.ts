import { currentUser } from "@/lib/currentUser";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (_: Request) => {
  try {
    const user = await currentUser();

    if (!user) return NextResponse.error();

    return NextResponse.json(new ApiResponse(user));
  } catch (error) {
    return NextResponse.error();
  }
};
