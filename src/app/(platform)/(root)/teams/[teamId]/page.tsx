import React from "react";
import { mockTeams as teams } from "@/constants";
import TeamDetails from "../_components/TeamDetails";
const TeamIdPage = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const { teamId } = await params;
  const team = teams.find((team) => team.id === teamId);

  return <TeamDetails abbreviation={team?.abbreviation as string} team={team as any} />;
};

export default TeamIdPage;
