import React from "react";
import { mockTeams as teams } from "@/constants";
import TeamDetails from "../_components/TeamDetails";
const TeamIdPage = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const teamId = (await params).teamId;
  const team = teams.find(async (team) => team.id === teamId);

  console.log(team);

  return <TeamDetails abbreviation={team?.abbreviation as string} />;
};

export default TeamIdPage;
