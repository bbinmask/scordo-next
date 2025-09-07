import React from "react";
import TeamCard from "../_components/TeamCard";
import { teams } from "@/constants/index";
import { TeamsList } from "../_components/TeamComponents";
import NotFoundParagraph from "@/components/NotFoundParagraph";
const MyTeamsPage = () => {
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
