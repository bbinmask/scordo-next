import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { ERROR_CODES } from "@/constants";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await currentUser();
  if (!user) return NextResponse.json(new ApiError(ERROR_CODES.UNAUTHORIZED), { status: 401 });

  try {
    // Step 1: get all accepted friend IDs
    const friendships = await db.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: user.id }, { addresseeId: user.id }],
      },
      select: { requesterId: true, addresseeId: true },
    });

    const friendIds = friendships.map((f) =>
      f.requesterId === user.id ? f.addresseeId : f.requesterId
    );

    if (friendIds.length === 0) {
      return NextResponse.json(new ApiResponse([], 200));
    }

    // Step 2: find all tournaments where any friend is a player in a participating team
    const tournaments = await db.tournament.findMany({
      where: {
        participatingTeams: {
          some: {
            team: {
              players: {
                some: { userId: { in: friendIds } },
              },
            },
          },
        },
      },
      include: {
        organizer: {
          select: { name: true, username: true, avatar: true },
        },
        _count: {
          select: { participatingTeams: true },
        },
        participatingTeams: {
          include: {
            team: {
              include: {
                players: {
                  where: { userId: { in: friendIds } },
                  include: {
                    user: {
                      select: { name: true, username: true, avatar: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    // Step 3: shape response — attach flat friends[] list per tournament
    const shaped = tournaments.map((t) => {
      const friends = t.participatingTeams.flatMap((tt) =>
        tt.team.players.map((p) => p.user)
      );
      // deduplicate by username
      const seen = new Set<string>();
      const uniqueFriends = friends.filter((f) => {
        if (seen.has(f.username)) return false;
        seen.add(f.username);
        return true;
      });

      const { participatingTeams, ...rest } = t;
      return { ...rest, friends: uniqueFriends };
    });

    return NextResponse.json(new ApiResponse(shaped, 200));
  } catch (error) {
    console.error("[tournaments/friends]", error);
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
