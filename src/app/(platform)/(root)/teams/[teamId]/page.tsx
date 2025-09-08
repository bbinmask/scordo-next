import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";
import TeamDetails from "../_components/TeamDetails";

interface TeamIdProps {
  params?: Promise<{ teamId: string }>;
}

const TeamIdPage: React.FC<TeamIdProps> = async ({ params }) => {
  const resolved = await params;
  const id = resolved?.teamId;

  const team = await db.team.findUnique({
    where: {
      id,
    },
    include: {},
  });

  console.log(team);

  if (!team) {
    return notFound();
  }

  return (
    <div className="center flex w-full">
      <div className="container-bg w-full rounded-2xl border p-4">
        <TeamDetails team={team} abbreviation={team.abbreviation} />
      </div>
    </div>
  );
};

export default TeamIdPage;
