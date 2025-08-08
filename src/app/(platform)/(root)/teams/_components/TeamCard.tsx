const TeamCard = ({ team }: { team: any }) => {
  return (
    <div className="dark:via-main dark:to-main transform rounded-2xl border border-lime-300 bg-gradient-to-br from-lime-50 to-green-100 p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:border-emerald-600 dark:from-green-700">
      <h3 className="mb-2 text-xl font-bold text-green-800 dark:text-lime-300">{team.name}</h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
        {team.description}
      </p>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p>
          <span className="font-semibold">Players:</span> {team.players}
        </p>
        <p>
          <span className="font-semibold">Matches:</span> {team.matches}
        </p>
      </div>
      <button className="mt-6 w-full transform rounded-lg bg-gradient-to-r from-emerald-600 to-green-700 px-5 py-2 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-emerald-400 focus:outline-none dark:focus:ring-emerald-600">
        View Scorecard
      </button>
    </div>
  );
};

export default TeamCard;
