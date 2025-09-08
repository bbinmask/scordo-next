import React from "react";
import TeamCard from "../_components/TeamCard";
import { TeamsList } from "../_components/TeamComponents";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
const MyTeamsPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const teams = await db.team.findMany({
    where: {
      owner: user.publicMetadata.id as string,
    },
  });

  console.log(teams);
  return;

  return (
    <div className="rounded-3xl border transition-all duration-300">
      <h1 className="text-main mb-4 text-center font-[Poppins] text-3xl font-black">Your Teams</h1>
      {teams.length === 0 ? (
        <NotFoundParagraph description=" No squads found. Time to step onto the pitch and form one!" />
      ) : (
        <TeamsList teams={teams} />
      )}
    </div>
  );
};

export default MyTeamsPage;
