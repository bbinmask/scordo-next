import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await currentUser();

  if (!user) return NextResponse.error();

  const teamsAsPlayer = await db.team.findMany({
    where: {
      players: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      players: true,
    },
  });

  const teamInvitations = await db.teamRequest.findMany({
    where: {
      toId: user.id,
    },
    include: {
      team: true,
      from: true,
    },
  });

  return NextResponse.json({ user, teamInvitations, teamsAsOwner: user.teamsOwned, teamsAsPlayer });
};
