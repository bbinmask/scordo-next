import { ERROR_CODES } from "@/constants";
import { currentOverData } from "@/lib/match/current-over";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ inningId: string }> }) => {
  const { inningId } = await params;

  if (!inningId) return NextResponse.json(new ApiError(ERROR_CODES.BAD_REQUEST));

  try {
    const currentOver = await currentOverData(inningId);

    if (!currentOver.success) return NextResponse.json(currentOver);

    return NextResponse.json(new ApiResponse(currentOver.data));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR));
  }
};
