const TeamsPage = () => {
  return (
    <div>
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-wide text-green-800 drop-shadow-lg sm:text-5xl dark:text-lime-300">
          Your Cricket Squads
        </h1>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          Unite with players and form your championship-winning teams.
        </p>
      </div>

      {/* Your Teams Section */}
      <div className="mb-16 rounded-3xl border border-gray-300 bg-white p-6 shadow-2xl transition-all duration-300 sm:p-10 dark:border-gray-700 dark:bg-gray-800">
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
      <div className="mb-16 rounded-3xl border border-gray-300 bg-white p-6 shadow-2xl transition-all duration-300 sm:p-10 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-extrabold tracking-wide text-green-800 drop-shadow-lg sm:text-3xl dark:text-lime-300">
          Squad Statistics
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatsCard
            title="Total Players"
            value="150+"
            iconPath="M12 5.9c.95 0 1.84.44 2.45 1.2a3.46 3.46 0 00-.09 1.15c0 1.93-1.57 3.5-3.5 3.5S8.5 10.28 8.5 8.35c0-.4.07-.79.22-1.15.61-.76 1.5-1.2 2.45-1.2zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
          <StatsCard
            title="Matches Played"
            value="750+"
            iconPath="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
          <StatsCard
            title="Highest Win Rate"
            value="95%"
            iconPath="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
