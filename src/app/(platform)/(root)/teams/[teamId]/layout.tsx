import { db } from "@/lib/db";
import React from "react";

const TeamIdLayout = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const resolved = await params;
  const abbr = resolved?.teamId.split("-team-")[1];

  if (!abbr) {
    return;
  }
  const team = await db.team.findFirst({
    where: { abbreviation: abbr },
    include: {
      owner: true,
      players: {
        select: {
          id: true,
          userId: true,
          teamId: true,
          user: true,
        },
      },
      captain: true,

      joinRequests: true,
      matchesAsTeamA: {
        select: { id: true, result: true },
      },
      matchesAsTeamB: {
        select: { id: true, result: true },
      },
    },
  });

  return <div></div>;
};

export default TeamIdLayout;
