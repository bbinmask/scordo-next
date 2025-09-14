"use client";

import {
  Sun,
  Moon,
  BarChartHorizontal,
  Trophy,
  Shield,
  Zap,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

import { PlayerStatCard, RecentMatchItem, StatCard } from "../_components/MatchStats";

const teamStatsData = {
  team: {
    name: "Royal Challengers Bengaluru",
    logo: "https://placehold.co/100x100/A62626/FFFFFF?text=RCB",
  },
  season: "2025",
  overall: {
    played: 14,
    won: 9,
    lost: 5,
    winPercentage: ((9 / 14) * 100).toFixed(2),
    points: 18,
    netRunRate: "+0.678",
  },
  battingLeaders: [
    {
      name: "Virat Kohli",
      stat: "680 Runs",
      achievement: "Orange Cap Holder",
      avatar: "https://placehold.co/60x60/A62626/FFFFFF?text=VK",
    },
    {
      name: "Faf du Plessis",
      stat: "550 Runs",
      achievement: "Highest Score: 112*",
      avatar: "https://placehold.co/60x60/A62626/FFFFFF?text=FDP",
    },
    {
      name: "Glenn Maxwell",
      stat: "45 Sixes",
      achievement: "Most Sixes Award",
      avatar: "https://placehold.co/60x60/A62626/FFFFFF?text=GM",
    },
  ],
  bowlingLeaders: [
    {
      name: "Mohammed Siraj",
      stat: "25 Wickets",
      achievement: "Purple Cap Contender",
      avatar: "https://placehold.co/60x60/A62626/FFFFFF?text=MS",
    },
    {
      name: "Harshal Patel",
      stat: "22 Wickets",
      achievement: "Best Figures: 5/18",
      avatar: "https://placehold.co/60x60/A62626/FFFFFF?text=HP",
    },
    {
      name: "Wanindu Hasaranga",
      stat: "6.85 Econ",
      achievement: "Best Economy Rate",
      avatar: "https://placehold.co/60x60/A62626/FFFFFF?text=WH",
    },
  ],
  recentMatches: [
    { opponent: "CSK", result: "W", margin: "by 7 wickets" },
    { opponent: "MI", result: "W", margin: "by 25 runs" },
    { opponent: "GT", result: "L", margin: "by 3 wickets" },
    { opponent: "SRH", result: "W", margin: "by 5 wickets" },
    { opponent: "DC", result: "L", margin: "by 15 runs" },
  ],
};

const TeamsStatsPage = () => {
  console.log("Error");
  alert("I'm here");

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-4 font-sans transition-colors duration-500 md:p-8 dark:bg-gradient-to-br dark:from-gray-900 dark:to-green-900">
        <div className="mx-auto max-w-7xl">
          {/* Overall Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <StatCard
              title="Played"
              value={teamStatsData.overall.played}
              icon={BarChartHorizontal}
            />
            <StatCard title="Won" value={teamStatsData.overall.won} icon={Trophy} />
            <StatCard title="Lost" value={teamStatsData.overall.lost} icon={Shield} />
            <StatCard
              title="Win %"
              value={`${teamStatsData.overall.winPercentage}%`}
              icon={TrendingUp}
            />
            <StatCard title="Points" value={teamStatsData.overall.points} icon={Zap} />
            <StatCard title="NRR" value={teamStatsData.overall.netRunRate} icon={TrendingUp} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Batting Leaders */}
            <div className="space-y-4 lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Batting Performers
              </h2>
              {teamStatsData.battingLeaders.map((player, i) => (
                <PlayerStatCard key={i} {...player} />
              ))}
            </div>

            {/* Bowling Leaders */}
            <div className="space-y-4 lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Bowling Performers
              </h2>
              {teamStatsData.bowlingLeaders.map((player, i) => (
                <PlayerStatCard key={i} {...player} />
              ))}
            </div>

            {/* Recent Matches */}
            <div className="lg:col-span-1">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recent Form</h2>
              <div className="rounded-lg border border-white/20 bg-white/30 p-4 shadow-md backdrop-blur-lg dark:bg-white/10">
                <ul className="space-y-3">
                  {teamStatsData.recentMatches.map((match, i) => (
                    <RecentMatchItem key={i} {...match} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsStatsPage;
