"use client";

import { useMemo } from "react";
import { DoughnutChart } from "../../_components/charts/doughnut-chart";
import { StatBox } from "../../_components/cards/StatBox";
import { BentoCard } from "../../_components/cards/bento-card";
import {
  Trophy, Sword, Flame, Activity, Zap, Star,
  ShieldCheck, Medal, CheckCircle2, Shield, History, ArrowUpRightIcon,
} from "lucide-react";

interface TournamentStatsProps {
  matches: {
    status: string;
    result: string | null;
    winnerId: string | null;
    teamAId: string;
    teamBId: string;
    innings: { runs: number; wickets: number; overs: number; battingTeamId: string }[];
  }[];
  leaderboard: {
    mostRuns:    { runs: number; sixes: number; fours: number }[];
    mostWickets: { wickets: number; maidens: number }[];
  } | null;
}

export function TournamentStats({ matches, leaderboard }: TournamentStatsProps) {
  const stats = useMemo(() => {
    const completed = matches.filter((m) => m.status === "completed");
    const played    = completed.length;

    const allRuns    = leaderboard?.mostRuns.reduce((a, b) => a + b.runs,    0) ?? 0;
    const allWickets = leaderboard?.mostWickets.reduce((a, b) => a + b.wickets, 0) ?? 0;
    const allSixes   = leaderboard?.mostRuns.reduce((a, b) => a + b.sixes,   0) ?? 0;
    const allFours   = leaderboard?.mostRuns.reduce((a, b) => a + b.fours,   0) ?? 0;
    const allMaidens = leaderboard?.mostWickets.reduce((a, b) => a + b.maidens, 0) ?? 0;

    const allInnings = completed.flatMap((m) => m.innings);
    const scores     = allInnings.map((i) => i.runs);
    const highScore  = scores.length ? Math.max(...scores) : 0;
    const lowScore   = scores.length ? Math.min(...scores) : 0;
    const avgScore   = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(0) : "0";

    const boundaryRuns = allFours * 4 + allSixes * 6;
    const fieldRuns    = allRuns - boundaryRuns;

    return {
      played, allRuns, allWickets, allSixes, allFours, allMaidens,
      highScore, lowScore, avgScore, boundaryRuns, fieldRuns,
    };
  }, [matches, leaderboard]);

  if (stats.played === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
          <Trophy className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="font-[urbanist] text-sm font-semibold text-slate-400">
          Stats will appear once matches are played.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-14 px-1">

      {/* ── Overview charts ─────────────────────────────────────────────── */}
      <div>
        <SectionHeading icon={Trophy} label="Tournament Overview" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DoughnutChart
            title="Scoring Profile"
            description={`${stats.allRuns} total runs in ${stats.played} matches`}
            data={[
              { name: "Boundary Runs", value: stats.boundaryRuns, fill: "#10b981" },
              { name: "Field Runs",    value: stats.fieldRuns,    fill: "#3b82f6" },
            ]}
            centerValue={`${stats.allRuns}`}
            centerLabel="Runs"
            footerText={`Avg team score: ${stats.avgScore}`}
          />
          <DoughnutChart
            title="Boundary Impact"
            description="Fours vs Sixes breakdown"
            data={[
              { name: "Fours",  value: stats.allFours,  fill: "#3b82f6" },
              { name: "Sixes",  value: stats.allSixes,  fill: "#10b981" },
            ]}
            centerValue={stats.allFours + stats.allSixes}
            centerLabel="Boundaries"
            footerText={`${stats.allSixes} maximums hit`}
          />
          <BentoCard
            className="group relative flex flex-col items-center justify-center overflow-hidden bg-emerald-600 !text-white"
            title="Matches Played"
          >
            <Shield className="absolute -right-6 -bottom-6 h-28 w-28 -rotate-12 text-white/10 transition-transform duration-700 group-hover:rotate-0" />
            <div className="relative z-10 text-center">
              <h4 className="mb-1 font-[poppins] text-6xl font-black italic tracking-tighter text-white">
                {stats.played}
              </h4>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
                <span className="font-[urbanist] text-[10px] font-black tracking-widest text-emerald-100 uppercase">
                  Completed Fixtures
                </span>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* ── Batting stats ───────────────────────────────────────────────── */}
      <div>
        <SectionHeading icon={Sword} label="Batting Highlights" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <DoughnutChart
              title="Run Sources"
              description="How runs were scored"
              data={[
                { name: "Field Runs",    value: stats.fieldRuns,    fill: "#f59e0b" },
                { name: "Fours (4×)",    value: stats.allFours * 4, fill: "#3b82f6" },
                { name: "Sixes (6×)",    value: stats.allSixes * 6, fill: "#10b981" },
              ]}
              centerValue={`${((stats.boundaryRuns / (stats.allRuns || 1)) * 100).toFixed(0)}%`}
              centerLabel="Boundary %"
              footerText={`${stats.allRuns} total runs across tournament`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-8">
            <StatBox label="Total Runs"   value={stats.allRuns}   icon={Zap}      color="emerald" subLabel="All innings" />
            <StatBox label="Total Fours"  value={stats.allFours}  icon={Star}     color="blue"    subLabel="Boundaries" />
            <StatBox label="Total Sixes"  value={stats.allSixes}  icon={Trophy}   color="emerald" subLabel="Maximums" />
            <StatBox label="Highest Score" value={stats.highScore} icon={Activity} color="emerald" subLabel="Best innings" />
          </div>
        </div>
      </div>

      {/* ── Bowling stats ───────────────────────────────────────────────── */}
      <div>
        <SectionHeading icon={Flame} label="Bowling Highlights" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="order-2 grid grid-cols-2 gap-4 lg:order-1 lg:col-span-8">
            <StatBox label="Total Wickets" value={stats.allWickets} icon={Medal}      color="emerald" subLabel="Taken" />
            <StatBox label="Total Maidens" value={stats.allMaidens} icon={ShieldCheck} color="emerald" subLabel="Control overs" />
            <StatBox label="Avg Team Score" value={stats.avgScore}  icon={Activity}   color="emerald" subLabel="Per inning" />
            <StatBox label="Lowest Score"  value={stats.lowScore}   icon={Flame}      color="rose"    subLabel="Best defense" />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-4">
            <DoughnutChart
              title="Bowling Impact"
              description={`${stats.allWickets} wickets taken`}
              data={[
                { name: "Wickets", value: stats.allWickets, fill: "#ef4444" },
                { name: "Maidens", value: stats.allMaidens, fill: "#10b981" },
              ]}
              centerValue={stats.allWickets}
              centerLabel="Wickets"
              footerText={`${stats.allMaidens} maiden overs bowled`}
            />
          </div>
        </div>
      </div>

    </div>
  );
}

function SectionHeading({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-[poppins] text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
        {label}
      </h3>
      <div className="ml-2 h-px flex-1 bg-slate-100 dark:bg-white/5" />
    </div>
  );
}
