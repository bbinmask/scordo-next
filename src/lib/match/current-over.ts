import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { db } from "../db";
import { ERROR_CODES } from "@/constants";

export const currentOverData = async (inningId: string) => {
  const inning = await db.inning.findUnique({
    where: { id: inningId },
  });

  if (!inning) return { success: false, error: ERROR_CODES.NOT_FOUND.message };

  const currentOver = await db.ball.findMany({
    where: {
      inningId,
    },
    select: {
      runs: true,
      ball: true,
      bowlerId: true,
      id: true,
      isBye: true,
      isLegBye: true,
      isNoBall: true,
      isWicket: true,
      isWide: true,
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });

  return { success: true, data: currentOver };
};
