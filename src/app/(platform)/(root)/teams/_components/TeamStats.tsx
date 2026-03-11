"use client";

import {
  Activity,
  ArrowUpRightIcon,
  CheckCircle2,
  Crown,
  Flame,
  History,
  Medal,
  Shield,
  ShieldCheck,
  Star,
  Sword,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { DoughnutChart } from "../../_components/charts/doughnut-chart";
import { StatBox } from "../../_components/cards/StatBox";
import { BentoCard } from "../../_components/cards/bento-card";
import { TeamStatsData } from "@/lib/types";

export const TeamStats = ({
  inningsBatted,
  inningsBowled,
  allBattingStats,
  allBowlingStats,
  results,
}: TeamStatsData) => {
  const stats = useMemo(() => {
    const played = results.length;
    const wins = results.filter((r) => r === "W").length;
    const losses = results.filter((r) => r === "L").length;
    const draws = results.filter((r) => r === "D").length;
    const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : "0.0";
    const winLossRatio = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);

    const totalRunsScored = inningsBatted.reduce((acc, curr) => acc + curr.runs, 0);
    const totalFours = allBattingStats?.fours || 0;
    const totalSixes = allBattingStats?.sixes || 0;
    const totalDotsBatted = allBattingStats?.dots || 0;
    const highestTeamScore = Math.max(...inningsBatted.map((i) => i.runs), 0);

    const totalWicketsTaken = inningsBowled.reduce((acc, curr) => acc + curr.wickets, 0);
    const totalRunsConceded = inningsBowled.reduce((acc, curr) => acc + curr.runs, 0);
    const totalLegalBallsBowled = allBowlingStats?.balls || 0;
    const totalMaidens = allBowlingStats?.maidens || 0;

    const totalOversBatted = inningsBatted.reduce((acc, curr) => acc + curr.overs, 0);
    const teamRR = totalOversBatted > 0 ? (totalRunsScored / totalOversBatted).toFixed(2) : "0.00";
    const teamEconomy =
      totalLegalBallsBowled > 0
        ? ((totalRunsConceded / totalLegalBallsBowled) * 6).toFixed(2)
        : "0.00";
    const bowlingAvg =
      totalWicketsTaken > 0 ? (totalRunsConceded / totalWicketsTaken).toFixed(2) : "0.00";
    const avgRunsPerInning = played > 0 ? (totalRunsScored / played).toFixed(0) : "0";

    const boundaryRuns = totalFours * 4 + totalSixes * 6;

    return {
      played,
      wins,
      losses,
      draws,
      winRate,
      winLossRatio,
      teamRR,
      teamEconomy,
      bowlingAvg,
      avgRunsPerInning,
      highestTeamScore,
      totalWicketsTaken,
      totalMaidens,
      totalDotsBatted,
      boundaryRuns,
      fieldRuns: totalRunsScored - boundaryRuns,
    };
  }, [inningsBatted, inningsBowled, allBattingStats, allBowlingStats, results]);

  return (
    <div className="w-full space-y-16 font-sans">
      <div>
        <div className="mb-6 flex items-center gap-3 px-4">
          <div className={`rounded-xl bg-emerald-500/10 p-2 text-emerald-500`}>
            <Trophy size={20} />
          </div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
            Stats
          </h3>
          <div className="ml-4 h-px flex-1 bg-slate-100 dark:bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DoughnutChart
            title="Victory Distribution"
            description=""
            footerText=""
            data={[
              { name: "Won", value: stats.wins, fill: "#10b981" },
              { name: "Lost", value: stats.losses, fill: "#ef4444" },
              { name: "Draw", value: stats.draws, fill: "#3b82f6" },
            ]}
            centerValue={stats.winLossRatio}
            centerLabel="W/L Ratio"
          />
          <DoughnutChart
            title="Scoring Profile"
            description=""
            footerText=""
            data={[
              { name: "Boundaries", value: stats.boundaryRuns, fill: "#f59e0b" },
              { name: "Running", value: stats.fieldRuns, fill: "#6366f1" },
            ]}
            centerValue={`${((stats.boundaryRuns / (stats.boundaryRuns + stats.fieldRuns || 1)) * 100).toFixed(0)}%`}
            centerLabel="Boundary Impact"
          />
          <BentoCard
            className="group relative flex flex-col items-center justify-center overflow-hidden bg-indigo-600 p-8 text-white"
            title="Overall Win Rate"
          >
            <Shield className="absolute -right-6 -bottom-6 h-32 w-32 -rotate-12 text-white/10 transition-transform duration-700 group-hover:rotate-0" />
            <div className="relative z-10 text-center">
              <h4 className="mb-2 text-6xl font-black tracking-tighter italic">{stats.winRate}%</h4>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black tracking-widest text-indigo-100 uppercase">
                  Competitive Status: Active
                </span>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* HEADING: BATTING ANALYTICS */}
      <div>
        <div className="mb-6 flex items-center gap-3 px-4">
          <div className={`rounded-xl bg-emerald-500/10 p-2 text-emerald-500`}>
            <Sword size={20} />
          </div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
            Batting Performance Analysis
          </h3>
          <div className="ml-4 h-px flex-1 bg-slate-100 dark:bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox
            label="Total Fixtures"
            value={stats.played}
            icon={Swords}
            color="indigo"
            subLabel="Matches"
          />
          <StatBox
            label="Innings High"
            value={stats.highestTeamScore}
            icon={Trophy}
            color="emerald"
            subLabel="Best Team Total"
          />
          <StatBox
            label="Avg Per Inning"
            value={stats.avgRunsPerInning}
            icon={Activity}
            color="emerald"
            subLabel="Mean Score"
          />
          <StatBox
            label="Run Rate"
            value={stats.teamRR}
            icon={Zap}
            color="amber"
            subLabel="Strike Intent"
          />

          <BentoCard
            title="Innings Pressure"
            icon={Crown}
            className="group relative flex items-center justify-between overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white lg:col-span-4"
          >
            <div className="relative z-10">
              <h4 className="text-2xl font-black uppercase italic">Total Dot Balls Faced</h4>
            </div>
            <div className="relative z-10 text-right">
              <p className="text-4xl font-black tracking-tighter text-emerald-400">
                {stats.totalDotsBatted}
              </p>
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase italic">
                Across all batted innings
              </p>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* HEADING: BOWLING ANALYTICS */}
      <div>
        <div className="mb-6 flex items-center gap-3 px-4">
          <div className={`rounded-xl bg-emerald-500/10 p-2 text-emerald-500`}>
            <Flame size={20} />
          </div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
            Bowling Analysis
          </h3>
          <div className="ml-4 h-px flex-1 bg-slate-100 dark:bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox
            label="Wickets Taken"
            value={stats.totalWicketsTaken}
            icon={Medal}
            color="indigo"
            subLabel="Defensive Power"
          />
          <StatBox
            label="Economy"
            value={stats.teamEconomy}
            icon={Flame}
            color="indigo"
            subLabel="Runs/Over"
          />
          <StatBox
            label="Bowl Average"
            value={stats.bowlingAvg}
            icon={ShieldCheck}
            color="indigo"
            subLabel="Runs/Wicket"
          />
          <StatBox
            label="Total Maidens"
            value={stats.totalMaidens}
            icon={Star}
            color="indigo"
            subLabel="Control Overs"
          />
        </div>
      </div>

      {/* HEADING: FORM & DOSSIER */}
      <div>
        <div className="mb-6 flex items-center gap-3 px-4">
          <div className={`rounded-xl bg-emerald-500/10 p-2 text-emerald-500`}>
            <History size={20} />
          </div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
            Tactical History
          </h3>
          <div className="ml-4 h-px flex-1 bg-slate-100 dark:bg-white/5" />
        </div>
        <div className="flex flex-col items-center justify-between gap-8 rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm md:flex-row dark:border-white/5 dark:bg-slate-900">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Recent Form Pattern:
            </span>
            <div className="flex gap-2">
              {results.slice(-5).map((res, i) => (
                <div
                  key={i}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-sm font-black shadow-sm transition-all hover:scale-110 ${
                    res === "W"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : res === "L"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  {res}
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full items-center gap-4 md:w-auto">
            <div className="mx-4 hidden h-12 w-px bg-slate-100 lg:block dark:bg-white/5" />
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-10 py-4 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all hover:translate-x-1 active:scale-95 md:w-auto dark:bg-white dark:text-slate-950">
              Detailed Match Dossier <ArrowUpRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
