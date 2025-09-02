import NotFoundParagraph from "@/components/NotFoundParagraph";
import TeamCard from "./TeamCard";
import { teams } from "@/constants";
const MyTeams = () => {
  return (
    <div className="bg-background-primary rounded-3xl border border-gray-300 p-6 shadow-2xl transition-all duration-300 sm:p-10 dark:border-gray-700 dark:bg-gray-800">
      <div className="animate-fade-in">
        <h2 className="mb-8 text-center font-[poppins] text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          My Squads
        </h2>
        {teams.length === 0 ? (
          <NotFoundParagraph />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teams.map((squad) => (
              <TeamCard key={squad.id} team={squad} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <button className="transform rounded-full bg-gradient-to-r from-red-600 to-red-800 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-900 focus:ring-4 focus:ring-red-400 focus:outline-none dark:focus:ring-red-700">
            Form New Squad
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTeams;
