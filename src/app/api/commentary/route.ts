import { currentUser } from "@/lib/currentUser";
import { generateCommentary, CommentaryPayload } from "@/lib/commentary/engine";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";

export const POST = async (req: Request) => {
  // Verify the user is authenticated before generating commentary
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { matchId } = await req.json();

  if (!matchId) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

  try {
    const match = await db.match.findUnique({
      where: {
        id: matchId,
      },
      select: {
        innings: {
          select: {
            _count: true,
            id: true,
          },
        },
      },
    });

    if (!match) return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND));

    const balls = await db.ball.findMany({
      where: {
        inningId: match.innings.at(-1)?.id,
      },
      select: {
        commentary: {
          include: {
            ball: {
              select: {
                over: true,
                ball: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const commentary = balls.map((ball) => ball.commentary);

    return NextResponse.json(new ApiResponse(commentary), { status: 201 });
  } catch (error: any) {
    console.error("[/api/commentary] Error:", error);
    return NextResponse.json(
      { success: false, error: "Commentary generation failed" },
      { status: 500 }
    );
  }
};
