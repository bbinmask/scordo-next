import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";
import TeamDetails from "../_components/TeamDetails";

interface TeamIdProps {
  params?: Promise<{ teamId: string }>;
}

const TeamIdPage: React.FC<TeamIdProps> = async ({ params }) => {
  const resolved = await params;
  const abbr = resolved?.teamId.split("-team-")[1];

  if (!abbr) {
    return notFound();
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
  console.log(team);

  if (!team) {
    return notFound();
  }

  return (
    <div className="center flex w-full">
      <div className="container-bg w-full rounded-2xl border">
        <TeamDetails team={team} />
      </div>
    </div>
  );
};

export default TeamIdPage;
