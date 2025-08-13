import React from "react";
import TeamCard from "../_components/TeamCard";
import { mockTeams as teams } from "@/constants/index";
import { TeamsList } from "../_components/TeamComponents";
const MyTeamsPage = () => {
  return (
    <div className="rounded-3xl border border-gray-300 bg-white py-6 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800">
      <h1 className="text-main mb-4 text-center font-[Poppins] text-3xl font-black dark:text-gray-100">
        My Teams
      </h1>
      {teams.length === 0 ? (
        <p className="py-10 text-center text-lg text-gray-500 dark:text-gray-400">
          No squads found. Time to step onto the pitch and form one!
        </p>
      ) : (
        <TeamsList teams={teams} />
      )}
    </div>
  );
};

export default MyTeamsPage;
