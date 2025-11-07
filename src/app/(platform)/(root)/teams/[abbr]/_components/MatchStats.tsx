"use client";

import React, { useState } from "react";
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

// --- MOCK DATA for the component ---

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

// --- Sub-Components ---

export const StatCard = ({ title, value, icon: Icon }) => (
  <div className="rounded-lg border border-white/20 bg-white/30 p-4 text-center shadow-md backdrop-blur-lg dark:bg-white/10">
    <div className="flex items-center justify-center">
      <Icon className="mr-2 h-6 w-6 text-yellow-500" />
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
    </div>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export const PlayerStatCard = ({ name, stat, achievement, avatar }) => (
  <div className="flex items-center space-x-4 rounded-lg border border-white/20 bg-white/30 p-4 shadow-md backdrop-blur-lg dark:bg-white/10">
    <img src={avatar} alt={name} className="h-14 w-14 rounded-full border-2 border-yellow-500" />
    <div>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{name}</p>
      <p className="font-semibold text-green-600 dark:text-green-400">{stat}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{achievement}</p>
    </div>
  </div>
);

export const RecentMatchItem = ({ opponent, result, margin }) => (
  <li className="flex items-center justify-between rounded-md bg-white/30 p-3 dark:bg-black/20">
    <div className="flex items-center">
      <span
        className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${result === "W" ? "bg-green-500" : "bg-red-500"}`}
      >
        {result}
      </span>
      <div>
        <p className="font-semibold text-gray-800 dark:text-gray-100">vs {opponent}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {result === "W" ? "Won" : "Lost"} {margin}
        </p>
      </div>
    </div>
    <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
  </li>
);
