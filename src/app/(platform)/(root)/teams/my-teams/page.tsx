import React from "react";
import { TeamsList } from "../_components/TeamComponents";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/lib/getUser";
import { Prisma } from "@/generated/prisma";

const MyTeamsPage = async () => {
  const user = await getUser();

  if (!user) return null;

  const teams = await db.team.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      players: true,
      captain: true,
      _count: true,
      owner: true,
    },
  });
  return (
    <div className="center flex w-full">
      <div className="container-bg w-full rounded-2xl border p-6 lg:p-10">
        <h2 className="primary-heading mb-6 text-center font-[cal_sans] text-3xl font-black tracking-wide">
          Your Teams
        </h2>
        {teams.length === 0 ? (
          <NotFoundParagraph
            description=" No squads found. Time to step onto the pitch and form one!"
            redirect
            title="Create a team"
            link="/teams/create"
          />
        ) : (
          <TeamsList teams={teams} />
        )}
      </div>
    </div>
  );
};

export default MyTeamsPage;
