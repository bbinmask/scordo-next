"use client";

import { useTeam } from "@/hooks/useTeam";
import MyTeams from "./_components/MyTeams";
import { TeamsList } from "./_components/TeamComponents";
import { useEffect, useState } from "react";
import TeamProps from "@/types/teams.props";
const TeamsPage = () => {
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const { fetchTeams } = useTeam();

  useEffect(() => {
    const getTeams = async () => {
      const data = await fetchTeams();
      if (data) setTeams(data);
    };
    getTeams();
  }, [fetchTeams]);

  return (
    <div>
      <TeamsList teams={teams} />
    </div>
  );
};

export default TeamsPage;
