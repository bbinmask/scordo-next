"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/generated/prisma";
import { InningBattingDetails, InningBowlingDetails } from "@/lib/types";
import { BattingStats } from "../../_components/cards/BattingStats";
import { BowlingStats } from "../../_components/cards/BowlingStats";
import { DefaultLoader } from "@/components/Spinner";
import { BentoCard } from "../../_components/cards/bento-card";
import { BarChart3, Gamepad2, ChevronRight, Trophy, TrendingUp, Target, Wind } from "lucide-react";
import { capitalize } from "lodash";
import { useState } from "react";
import Link from "next/link";

const tabs = [
  { id: "batting-stats", label: "Batting", icon: Target },
  { id: "bowling-stats", label: "Bowling", icon: Wind },
];

export default function ProfileHistoryPage() {
  const [currentTab, setCurrentTab] = useState("batting-stats");

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me");
      return data.data;
    },
  });

  const { data: battingRecords, isLoading: battingLoading } = useQuery<InningBattingDetails[]>({
    queryKey: ["batting-stats", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await axios.get(`/api/stats/user/batting?userId=${user!.id}`);
      if (!data.success) return [];
      return data.data;
    },
  });

  const { data: bowlingRecords, isLoading: bowlingLoading } = useQuery<InningBowlingDetails[]>({
    queryKey: ["bowling-stats", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await axios.get(`/api/stats/user/bowling?userId=${user!.id}`);
      if (!data.success) return [];
      return data.data;
    },
  });

  if (userLoading || !user) return <DefaultLoader />;

  const battingMatches = battingRecords?.length ?? 0;
  const bowlingMatches = bowlingRecords?.length ?? 0;
  const totalRuns = battingRecords?.reduce((a, b) => a + b.runs, 0) ?? 0;
  const totalWickets = bowlingRecords?.reduce((a, b) => a + b.wickets, 0) ?? 0;

  const isLoading = currentTab === "batting-stats" ? battingLoading : bowlingLoading;

  const hasData =
    currentTab === "batting-stats"
      ? battingRecords && battingRecords.length > 0
      : bowlingRecords && bowlingRecords.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 font-sans transition-colors duration-500 dark:bg-[#020617]">
      {/* Hero */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-green-800 md:h-52">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-[#020617]" />
        <div className="absolute inset-0 flex items-end px-6 pb-6 md:px-10">
          <div>
            <h1 className="font-[poppins] text-3xl font-black tracking-tight text-white md:text-4xl">
              Performance History
            </h1>
            <p className="mt-1 font-[urbanist] text-sm font-semibold text-green-200">
              @{user.username} · all-time career stats
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-4 max-w-5xl space-y-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-[urbanist] text-xs font-semibold text-slate-400">
          <Link href="/profile" className="transition-colors hover:text-green-500">
            Profile
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-300">History</span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <BentoCard title="Batting Innings" icon={Target} className="col-span-1">
            <p className="font-[poppins] text-3xl font-black text-slate-800 dark:text-white">
              {battingMatches}
            </p>
          </BentoCard>
          <BentoCard title="Total Runs" icon={TrendingUp} className="col-span-1">
            <p className="font-[poppins] text-3xl font-black text-emerald-500">{totalRuns}</p>
          </BentoCard>
          <BentoCard title="Bowling Innings" icon={Wind} className="col-span-1">
            <p className="font-[poppins] text-3xl font-black text-slate-800 dark:text-white">
              {bowlingMatches}
            </p>
          </BentoCard>
          <BentoCard title="Total Wickets" icon={Trophy} className="col-span-1">
            <p className="font-[poppins] text-3xl font-black text-emerald-500">{totalWickets}</p>
          </BentoCard>
        </div>

        {/* Tab Switcher */}
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex gap-1 rounded-2xl bg-slate-200/60 p-1 backdrop-blur-sm dark:bg-white/5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentTab(id)}
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 font-[urbanist] text-sm font-semibold whitespace-nowrap transition-all ${
                  currentTab === id
                    ? "bg-white text-green-600 shadow dark:bg-green-600 dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="hover-card min-h-[400px] overflow-hidden rounded-[2rem] border border-slate-200 p-8 dark:border-white/10 dark:bg-slate-900/30">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <div className="rounded-3xl bg-slate-100 p-4 shadow-inner dark:bg-slate-800">
                <BarChart3 className="h-10 w-10 animate-pulse text-green-500" />
              </div>
              <p className="font-[urbanist] text-sm font-semibold text-slate-400">Loading stats…</p>
            </div>
          ) : hasData ? (
            currentTab === "batting-stats" ? (
              <BattingStats user={user} battingRecords={battingRecords!} />
            ) : (
              <BowlingStats user={user} bowlingRecords={bowlingRecords!} />
            )
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-3xl bg-slate-100 p-4 shadow-inner dark:bg-slate-800">
                {currentTab === "batting-stats" ? (
                  <BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                ) : (
                  <Gamepad2 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <div>
                <h3 className="font-[poppins] text-xl font-black tracking-tight text-slate-700 uppercase italic dark:text-white">
                  No {capitalize(currentTab.replace("-", " "))} yet
                </h3>
                <p className="mt-1 font-[urbanist] text-sm font-semibold text-slate-400">
                  Play some matches to see your stats here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
