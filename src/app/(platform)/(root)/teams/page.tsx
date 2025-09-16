import { Group, Users } from "lucide-react";
import { StatsCard } from "./_components/stats/StatsCard";
import { MdLeaderboard } from "react-icons/md";

const TeamsPage = () => {
  return (
    <>
      {/* Your Teams Section */}
      <div className="container-bg mb-6 w-full rounded-xl p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-extrabold tracking-wide text-green-800 drop-shadow-lg sm:text-3xl dark:text-lime-300">
          My Squads
        </h2>
        <div className="text-center">
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            View and manage all the teams you have joined or created.
          </p>
          <a
            href="/teams/my-teams"
            className="inline-block transform rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-emerald-900"
          >
            Go to My Squads
          </a>
        </div>
      </div>

      {/* Team Statistics Section */}
      <div className="container-bg mb-6 w-full rounded-xl p-6 shadow-lg transition-all">
        <h2 className="mb-6 text-center text-2xl font-extrabold tracking-wide text-green-800 drop-shadow-lg sm:text-3xl dark:text-lime-300">
          Squad Statistics
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatsCard title="Total Players" value="150+" icon={<Users className="h-6 w-6" />} />
          <StatsCard title="Matches Played" value="750+" icon={<Group className="h-6 w-6" />} />
          <StatsCard
            title="Highest Win Rate"
            value="95%"
            icon={<MdLeaderboard className="h-6 w-6" />}
          />
        </div>
      </div>
    </>
  );
};

export default TeamsPage;
