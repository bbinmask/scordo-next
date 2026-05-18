"use client";
// src/app/(platform)/(root)/matches/quick-match/_components/QuickLiveScorecard.tsx
//
// Live scorecard for a Quick Match.
// Mirrors LiveScorecard.tsx layout and tables exactly — but reads from the
// QuickInning shape (local state) instead of Prisma/API InningDetails.
// The ControlPad column is replaced by QuickControlPad.

import { useMemo } from "react";
import { Flame, Target } from "lucide-react";
import { getEcon, getRunRate, getStrikeRate } from "@/utils/helper/scorecard";
import type { QuickMatch } from "@/types/quick-match.props";
import { type UseQuickMatchReturn } from "@/hooks/useQuickMatch";
import { QuickControlPad } from "./QuickControlPad";
import MatchStatusBadge from "@/app/(platform)/(root)/matches/_components/cards/MatchStatusBadge";

interface QuickLiveScorecardProps {
  match: QuickMatch;
  hook: UseQuickMatchReturn;
}

export function QuickLiveScorecard({ match, hook }: QuickLiveScorecardProps) {
  const { currentInning } = hook;

  const inning = currentInning;

  // ── Derived display values ─────────────────────────────────────────────
  const battingTeam = match.teamA.id === inning?.battingTeamId ? match.teamA : match.teamB;
  const bowlingTeam = match.teamA.id === inning?.bowlingTeamId ? match.teamA : match.teamB;

  // Run rate — overs completed (balls / 6)
  const ballsFaced = inning?.balls;
  const runRate = getRunRate(inning?.runs as number, ballsFaced as number);

  // Required run rate (second innings only)
  const firstInning = match.innings[0];
  const runsLeft = useMemo(() => {
    if (inning?.inningNumber !== 2 || !firstInning) return null;
    const needed = firstInning.runs + 1 - inning?.runs;
    const ballsLeft = match.overs * 6 - inning?.balls;
    if (needed <= 0 || match.status === "completed") return null;
    return `${needed} runs in ${ballsLeft} balls`;
  }, [inning, firstInning, match]);

  // Batsmen on crease
  const activeBatsmen = useMemo(
    () =>
      inning?.batting.filter(
        (b) =>
          (b.playerId === inning?.currentStrikerId || b.playerId === inning?.currentNonStrikerId) &&
          !b.isOut
      ),
    [inning]
  );

  // Current bowler
  const currentBowler = useMemo(
    () => inning?.bowling.find((b) => b.playerId === inning?.currentBowlerId),
    [inning]
  );

  if (!inning) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto grid max-w-7xl grid-cols-1 gap-8 duration-700 lg:grid-cols-12">
      {/* ── Main scorecard column ──────────────────────────────────── */}
      <div className="space-y-8 lg:col-span-8">
        {/* Score display */}
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 font-[inter] shadow-xl dark:border-white/10 dark:bg-slate-900">
          <MatchStatusBadge status={match.status} />

          <div className="relative mb-6">
            <p className="mb-1 text-[10px] font-bold tracking-wide text-slate-400 uppercase">
              Quick Match
            </p>
            <div className="flex items-center gap-3">
              <h2 className="primary-heading pr-2 text-4xl font-black uppercase italic">
                {battingTeam.abbreviation}
              </h2>
              <span className="font-bold text-slate-300 italic">vs</span>
              <span className="text-lg font-medium text-slate-400 uppercase">
                {bowlingTeam.abbreviation}
              </span>
            </div>
          </div>

          {/* Big score */}
          <div className="relative flex items-baseline justify-between gap-3">
            <div>
              <span className="text-8xl font-black tracking-tighter drop-shadow-lg">
                {inning.runs}
              </span>
              <span className="text-4xl font-light tracking-tighter text-slate-300">
                / {inning.wickets}
              </span>
            </div>

            {runsLeft && match.status !== "completed" && (
              <p className="text-xs text-wrap text-green-500">{runsLeft}</p>
            )}
            {match.status === "completed" && match.result && (
              <p className="max-w-[140px] text-right text-xs font-bold text-wrap text-green-500">
                {match.result}
              </p>
            )}
          </div>

          {/* Run rate row */}
          <div className="relative mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-green-700/5 p-4 backdrop-blur-sm">
              <p className="label-xs mb-1">Current RR</p>
              <p className="stat-value text-2xl">{runRate}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-4 backdrop-blur-sm">
              <p className="label-xs mb-1">Overs</p>
              <p className="stat-value text-2xl">
                {inning.overs}.{inning.balls % 6}
                <span className="ml-1 text-sm font-normal text-slate-400">/ {match.overs}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Batting table */}
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
              <Target className="h-4 w-4 text-green-500" /> Batting
            </h3>
            <span className="meta-text text-[10px]">{battingTeam.name}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-semibold tracking-widest text-slate-400 uppercase dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3">Batter</th>
                  <th className="px-4 py-3 text-center">R</th>
                  <th className="px-4 py-3 text-center">B</th>
                  <th className="px-4 py-3 text-center">4s</th>
                  <th className="px-4 py-3 text-center">6s</th>
                  <th className="px-4 py-3 text-center">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {activeBatsmen?.map((bat) => (
                  <tr
                    key={bat.playerId}
                    className={bat.playerId === inning.currentStrikerId ? "bg-green-500/5" : ""}
                  >
                    <td className="px-6 py-4 font-[poppins]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
                          {bat.player.user.name}
                        </span>
                        {bat.playerId === inning.currentStrikerId && (
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-900 dark:text-white">
                      {bat.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {bat.balls}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {bat.fours}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {bat.sixes}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-semibold text-green-500">
                      {getStrikeRate(bat.runs, bat.balls)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling table */}
        {currentBowler && (
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
              <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                <Flame className="h-4 w-4 text-green-500" /> Bowling
              </h3>
              <span className="meta-text text-[10px]">{bowlingTeam.name}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-semibold tracking-widest text-slate-400 uppercase dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3">Bowler</th>
                    <th className="px-4 py-3 text-center">O</th>
                    <th className="px-4 py-3 text-center">R</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">Wd</th>
                    <th className="px-4 py-3 text-center">Nb</th>
                    <th className="px-4 py-3 text-center">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-[urbanist] dark:divide-white/5">
                  <tr className="bg-green-500/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
                          {currentBowler?.player.user.name}
                        </span>
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {currentBowler.overs}.{currentBowler.balls % 6}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                      {currentBowler.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-green-500">
                      {currentBowler.wickets}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                      {currentBowler.wides}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                      {currentBowler.noBalls}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-semibold text-slate-400">
                      {getEcon(currentBowler.runs, currentBowler.balls)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Control pad column ──────────────────────────────────────── */}
      {match.status !== "not_started" && (
        <QuickControlPad match={match} inning={inning} hook={hook} />
      )}
    </div>
  );
}
