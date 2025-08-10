import React from "react";
import TeamCard from "../_components/TeamCard";
import TeamProps from "@/types/teams.props";

const MyTeamsPage = () => {
  const teams: TeamProps | [] = [];

  return (
    <div className="rounded-3xl border border-gray-300 bg-white p-6 shadow-2xl transition-all duration-300 sm:p-10 dark:border-gray-700 dark:bg-gray-800">
      <h1 className="mb-8 text-center font-[poppins] text-3xl font-extrabold text-gray-800 dark:text-gray-100">
        My Teams
      </h1>
      {teams.length === 0 ? (
        <p className="py-10 text-center text-lg text-gray-500 dark:text-gray-400">
          No squads found. Time to step onto the pitch and form one!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <TeamCard team={team} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeamsPage;
