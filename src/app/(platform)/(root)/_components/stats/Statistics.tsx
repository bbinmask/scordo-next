"use client";

import React, { useState } from "react";
import { Sun, Moon, BarChart2, Users, PieChart, TrendingUp, ShieldCheck } from "lucide-react";

// --- MOCK DATA for the component ---
const matchData = {
  tournament: "Indian Premier League 2025",
  venue: "M. Chinnaswamy Stadium, Bengaluru",
  status: "Royal Challengers Bengaluru won by 7 wickets",
  teams: {
    teamA: {
      name: "Chennai Super Kings",
      shortName: "CSK",
      logo: "https://placehold.co/100x100/FDB913/000000?text=CSK",
      score: "176/4",
      overs: "20",
    },
    teamB: {
      name: "Royal Challengers Bengaluru",
      shortName: "RCB",
      logo: "https://placehold.co/100x100/A62626/FFFFFF?text=RCB",
      score: "177/3",
      overs: "19.1",
    },
  },
  innings: [
    {
      team: "Chennai Super Kings",
      batting: [
        {
          name: "Ruturaj Gaikwad",
          dismissal: "c Maxwell b Siraj",
          runs: 32,
          balls: 25,
          fours: 4,
          sixes: 1,
          sr: 128.0,
        },
        {
          name: "Devon Conway",
          dismissal: "lbw b Hazlewood",
          runs: 47,
          balls: 35,
          fours: 5,
          sixes: 2,
          sr: 134.28,
        },
        {
          name: "Shivam Dube",
          dismissal: "run out (Kohli)",
          runs: 5,
          balls: 8,
          fours: 0,
          sixes: 0,
          sr: 62.5,
        },
        {
          name: "Ambati Rayudu",
          dismissal: "not out",
          runs: 62,
          balls: 40,
          fours: 6,
          sixes: 3,
          sr: 155.0,
        },
        {
          name: "MS Dhoni",
          dismissal: "not out",
          runs: 18,
          balls: 12,
          fours: 1,
          sixes: 1,
          sr: 150.0,
        },
      ],
      bowling: [
        { name: "Mohammed Siraj", overs: 4, maidens: 0, runs: 30, wickets: 1, econ: 7.5 },
        { name: "Josh Hazlewood", overs: 4, maidens: 0, runs: 28, wickets: 1, econ: 7.0 },
        { name: "Harshal Patel", overs: 4, maidens: 0, runs: 45, wickets: 0, econ: 11.25 },
        { name: "Wanindu Hasaranga", overs: 4, maidens: 0, runs: 32, wickets: 0, econ: 8.0 },
        { name: "Glenn Maxwell", overs: 4, maidens: 0, runs: 41, wickets: 0, econ: 10.25 },
      ],
      extras: 12,
      total: "176/4",
    },
    {
      team: "Royal Challengers Bengaluru",
      batting: [
        {
          name: "Virat Kohli",
          dismissal: "c Gaikwad b Chahar",
          runs: 75,
          balls: 50,
          fours: 8,
          sixes: 2,
          sr: 150.0,
        },
        {
          name: "Faf du Plessis",
          dismissal: "b Theekshana",
          runs: 22,
          balls: 18,
          fours: 3,
          sixes: 0,
          sr: 122.22,
        },
        {
          name: "Glenn Maxwell",
          dismissal: "st Dhoni b Jadeja",
          runs: 35,
          balls: 25,
          fours: 2,
          sixes: 2,
          sr: 140.0,
        },
        {
          name: "Dinesh Karthik",
          dismissal: "not out",
          runs: 28,
          balls: 15,
          fours: 3,
          sixes: 1,
          sr: 186.67,
        },
        {
          name: "Mahipal Lomror",
          dismissal: "not out",
          runs: 10,
          balls: 5,
          fours: 1,
          sixes: 0,
          sr: 200.0,
        },
      ],
      bowling: [
        { name: "Deepak Chahar", overs: 4, maidens: 0, runs: 35, wickets: 1, econ: 8.75 },
        { name: "Maheesh Theekshana", overs: 4, maidens: 0, runs: 29, wickets: 1, econ: 7.25 },
        { name: "Ravindra Jadeja", overs: 4, maidens: 0, runs: 40, wickets: 1, econ: 10.0 },
        { name: "Dwayne Bravo", overs: 3.1, maidens: 0, runs: 42, wickets: 0, econ: 13.55 },
        { name: "Moeen Ali", overs: 4, maidens: 0, runs: 31, wickets: 0, econ: 7.75 },
      ],
      extras: 7,
      total: "177/3",
    },
  ],
  players: {
    teamA: [
      {
        name: "MS Dhoni",
        role: "WK-Batsman",
        avatar: "https://placehold.co/40x40/FDB913/000000?text=MSD",
      },
      {
        name: "Ruturaj Gaikwad",
        role: "Batsman",
        avatar: "https://placehold.co/40x40/FDB913/000000?text=RG",
      },
      {
        name: "Ravindra Jadeja",
        role: "All-rounder",
        avatar: "https://placehold.co/40x40/FDB913/000000?text=RJ",
      },
    ],
    teamB: [
      {
        name: "Virat Kohli",
        role: "Batsman",
        avatar: "https://placehold.co/40x40/A62626/FFFFFF?text=VK",
      },
      {
        name: "Faf du Plessis",
        role: "Batsman",
        avatar: "https://placehold.co/40x40/A62626/FFFFFF?text=FDP",
      },
      {
        name: "Glenn Maxwell",
        role: "All-rounder",
        avatar: "https://placehold.co/40x40/A62626/FFFFFF?text=GM",
      },
    ],
  },
};

// --- Sub-Components ---

const ScorecardTable = ({ title, batting, bowling, extras }) => (
  <div className="rounded-lg border border-white/20 bg-white/30 p-4 shadow-md backdrop-blur-lg md:p-6 dark:bg-white/10">
    <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">{title} Innings</h3>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-400/30 text-left text-gray-600 dark:border-white/20 dark:text-gray-300">
            <th className="p-2 font-semibold">Batsman</th>
            <th className="p-2 text-center font-semibold">R</th>
            <th className="p-2 text-center font-semibold">B</th>
            <th className="p-2 text-center font-semibold">4s</th>
            <th className="p-2 text-center font-semibold">6s</th>
            <th className="p-2 text-center font-semibold">SR</th>
          </tr>
        </thead>
        <tbody>
          {batting.map((player, i) => (
            <tr key={i} className="border-b border-gray-400/20 dark:border-white/10">
              <td className="p-2">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{player.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{player.dismissal}</p>
              </td>
              <td className="p-2 text-center font-bold text-gray-900 dark:text-white">
                {player.runs}
              </td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">{player.balls}</td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">{player.fours}</td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">{player.sixes}</td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">
                {player.sr.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">Extras: {extras}</p>

    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-400/30 text-left text-gray-600 dark:border-white/20 dark:text-gray-300">
            <th className="p-2 font-semibold">Bowler</th>
            <th className="p-2 text-center font-semibold">O</th>
            <th className="p-2 text-center font-semibold">M</th>
            <th className="p-2 text-center font-semibold">R</th>
            <th className="p-2 text-center font-semibold">W</th>
            <th className="p-2 text-center font-semibold">Econ</th>
          </tr>
        </thead>
        <tbody>
          {bowling.map((player, i) => (
            <tr
              key={i}
              className="border-b border-gray-400/20 last:border-b-0 dark:border-white/10"
            >
              <td className="p-2 font-semibold text-gray-900 dark:text-gray-100">{player.name}</td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">{player.overs}</td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">{player.maidens}</td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">{player.runs}</td>
              <td className="p-2 text-center font-bold text-gray-900 dark:text-white">
                {player.wickets}
              </td>
              <td className="p-2 text-center text-gray-600 dark:text-gray-300">
                {player.econ.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AnalysisCard = ({ title, icon: Icon }) => (
  <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-white/20 bg-white/30 p-6 text-center shadow-md backdrop-blur-lg dark:bg-white/10">
    <Icon className="mb-4 h-12 w-12 text-yellow-500" />
    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">Analysis data coming soon.</p>
  </div>
);

const PlayerList = ({ teamName, players }) => (
  <div className="rounded-lg border border-white/20 bg-white/30 p-4 shadow-md backdrop-blur-lg md:p-6 dark:bg-white/10">
    <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">{teamName} Squad</h3>
    <ul className="space-y-3">
      {players.map((player, i) => (
        <li
          key={i}
          className="flex items-center justify-between rounded-md bg-white/30 p-2 dark:bg-black/20"
        >
          <div className="flex items-center">
            <img
              src={player.avatar}
              alt={player.name}
              className="mr-3 h-10 w-10 rounded-full border-2 border-yellow-500"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{player.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{player.role}</p>
            </div>
          </div>
          <ShieldCheck className="h-5 w-5 text-green-500" />
        </li>
      ))}
    </ul>
  </div>
);

const MatchStats = () => {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("scorecard");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${activeTab === id ? "bg-green-500 text-white shadow-lg" : "text-gray-800 hover:bg-white/50 dark:text-gray-200 dark:hover:bg-white/20"}`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 p-4 font-sans transition-colors duration-500 md:p-8 dark:bg-gradient-to-br dark:from-gray-900 dark:to-green-900">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl dark:text-white">
                Match Statistics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{matchData.tournament}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-full border border-white/20 bg-white/30 p-2 text-gray-800 backdrop-blur-md transition-colors duration-300 hover:bg-gray-300 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </button>
          </header>

          {/* Match Summary Card */}
          <div className="mb-8 rounded-xl border border-white/20 bg-white/30 p-4 shadow-lg backdrop-blur-lg md:p-6 dark:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-center md:text-left">
                <img
                  src={matchData.teams.teamA.logo}
                  alt={matchData.teams.teamA.name}
                  className="h-12 w-12 rounded-full border-2 border-yellow-500 md:h-16 md:w-16"
                />
                <div className="ml-4 hidden md:block">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {matchData.teams.teamA.name}
                  </p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {matchData.teams.teamA.score} ({matchData.teams.teamA.overs})
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{matchData.venue}</p>
                <p className="text-2xl font-bold text-gray-700 md:text-4xl dark:text-gray-200">
                  VS
                </p>
                <p className="mt-1 animate-pulse text-sm font-semibold text-green-600 dark:text-green-400">
                  {matchData.status}
                </p>
              </div>
              <div className="flex items-center text-center md:text-right">
                <div className="mr-4 hidden md:block">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {matchData.teams.teamB.name}
                  </p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {matchData.teams.teamB.score} ({matchData.teams.teamB.overs})
                  </p>
                </div>
                <img
                  src={matchData.teams.teamB.logo}
                  alt={matchData.teams.teamB.name}
                  className="h-12 w-12 rounded-full border-2 border-red-500 md:h-16 md:w-16"
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex w-full max-w-fit space-x-2 rounded-lg border border-white/20 bg-white/30 p-2 backdrop-blur-lg md:w-auto md:space-x-4 dark:bg-white/10">
            <TabButton id="scorecard" label="Scorecard" icon={BarChart2} />
            <TabButton id="analysis" label="Analysis" icon={PieChart} />
            <TabButton id="players" label="Players" icon={Users} />
          </div>

          {/* Content Area */}
          <div>
            {activeTab === "scorecard" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ScorecardTable
                  title={matchData.innings[0].team}
                  batting={matchData.innings[0].batting}
                  bowling={matchData.innings[1].bowling}
                  extras={matchData.innings[0].extras}
                />
                <ScorecardTable
                  title={matchData.innings[1].team}
                  batting={matchData.innings[1].batting}
                  bowling={matchData.innings[0].bowling}
                  extras={matchData.innings[1].extras}
                />
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnalysisCard title="Wagon Wheel" icon={PieChart} />
                <AnalysisCard title="Manhattan Chart" icon={BarChart2} />
                <AnalysisCard title="Run Rate Comparison" icon={TrendingUp} />
              </div>
            )}

            {activeTab === "players" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PlayerList
                  teamName={matchData.teams.teamA.name}
                  players={matchData.players.teamA}
                />
                <PlayerList
                  teamName={matchData.teams.teamB.name}
                  players={matchData.players.teamB}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;
