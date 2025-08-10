import NotFoundParagraph from "@/components/NotFoundParagraph";
import TeamCard from "./TeamCard";

const MyTeams = () => {
  const mySquads = [
    {
      id: "1",
      name: "Boundary Bashers",
      players: 11,
      matches: 7,
      description: "Aggressive batsmen, always looking for maximums.",
    },
    {
      id: "2",
      name: "Wicket Wreckers",
      players: 10,
      matches: 5,
      description: "Pace and spin combination, demolishing batting lineups.",
    },
    {
      id: "3",
      name: "Catching Comets",
      players: 12,
      matches: 6,
      description: "Agile fielders, never letting a chance slip.",
    },
    {
      id: "4",
      name: "Golden Gloves",
      players: 9,
      matches: 4,
      description: "Strategic wicketkeepers and captains with sharp instincts.",
    },
    {
      id: "5",
      name: "Powerplay Pioneers",
      players: 11,
      matches: 8,
      description: "Dominating the initial overs with bat and ball.",
    },
  ];

  return (
    <div className="bg-background-primary rounded-3xl border border-gray-300 p-6 shadow-2xl transition-all duration-300 sm:p-10 dark:border-gray-700 dark:bg-gray-800">
      <div className="animate-fade-in">
        <h2 className="mb-8 text-center font-[poppins] text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          My Squads
        </h2>
        {mySquads.length === 0 ? (
          <NotFoundParagraph />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mySquads.map((squad) => (
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
