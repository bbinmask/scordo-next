"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { Flame, LayoutList, Sword, Target, UserCircle2 } from "lucide-react";
import { InningDetails } from "@/lib/types";
import { getEcon, getStrikeRate } from "@/utils/helper/scorecard";
import { useMemo, useState } from "react";

export default function ScorecardPage() {
  const [activeInningIdx, setActiveInningIdx] = useState(0);

  const { id } = useParams<{ id: string }>();

  const { data: innings } = useQuery<InningDetails[]>({
    queryKey: ["match-innings", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${id}/innings`);
      if (!data.success) return [];
      return data.data;
    },
  });

  const { data: wicketsMap, isLoading: isLoadingWickets } = useQuery<Record<string, string> | null>(
    {
      queryKey: ["inning-wickets", innings?.[activeInningIdx]?.id],
      queryFn: async () => {
        const inningId = innings?.[activeInningIdx]?.id;
        if (!inningId) return null;

        const { data } = await axios.get(`/api/matches/innings/${inningId}/wickets`);
        if (!data.success) return null;

        const dismissalMap: Record<string, string> = {};
        for (const ball of data.data) {
          let text = "";
          const bowlerName = ball.bowler?.user.name;
          const fielderName = ball.fielder?.user.name;

          switch (ball.dismissalType) {
            case "CAUGHT":
              text =
                ball.fielder?.user.username === ball.bowler?.user.username
                  ? `c&b ${bowlerName}`
                  : `c. ${fielderName} b. ${bowlerName}`;
              break;
            case "BOWLED":
              text = `b. ${bowlerName}`;
              break;
            case "LBW":
              text = `lbw b. ${bowlerName}`;
              break;
            case "RUN_OUT":
              text = `run out (${fielderName})`;
              break;
            case "STUMPED":
              text = `st ${fielderName} b. ${bowlerName}`;
              break;
            case "HIT_WICKET":
              text = `hit wicket b. ${bowlerName}`;
              break;
            default:
              text = "out";
          }
          dismissalMap[ball.batsmanId] = text;
        }
        return dismissalMap;
      },
      enabled: !!innings?.[activeInningIdx]?.id,
    }
  );

  let currentInning = innings?.[activeInningIdx];

  const didNotBatPlayers = useMemo(() => {
    if (!currentInning) return [];
    return currentInning.InningBatting.filter(
      (b) =>
        !b.isOut &&
        b.playerId !== currentInning?.currentStrikerId &&
        b.playerId !== currentInning?.currentNonStrikerId &&
        b.runs === 0 &&
        b.balls === 0
    );
  }, [currentInning]);

  const battedPlayers = useMemo(() => {
    if (!currentInning) return [];
    return currentInning.InningBatting.filter(
      (b) =>
        b.isOut ||
        b.playerId === currentInning?.currentStrikerId ||
        b.playerId === currentInning?.currentNonStrikerId ||
        b.balls > 0
    );
  }, [currentInning]);

  if (!innings || innings.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
          <LayoutList className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          No Scorecard Available
        </h2>
        <p className="mt-2 text-slate-500">Wait for the match to begin to see live statistics.</p>
      </div>
    );
  }

  currentInning = innings[activeInningIdx];

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-slate-50/50 p-4 font-sans antialiased sm:p-8 dark:bg-slate-950">
      {/* Header Section */}
      <header className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h1 className="font-[poppins] text-3xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
            Scorecard
          </h1>
        </div>

        <div className="flex w-full overflow-hidden rounded-2xl bg-white p-1 ring-1 ring-slate-200 sm:w-auto dark:bg-slate-900 dark:ring-white/10">
          {innings.map((inning, idx) => (
            <button
              key={idx}
              onClick={() => setActiveInningIdx(idx)}
              className={`flex-1 px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all sm:flex-none ${
                activeInningIdx === idx
                  ? "rounded-xl bg-emerald-600 text-white shadow-md"
                  : "text-slate-500 hover:text-emerald-600"
              }`}
            >
              {inning.battingTeam.name}
            </button>
          ))}
        </div>
      </header>

      {/* Inning Overview Banner */}
      <div className="mb-8 overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
        <div className="relative flex flex-col items-center justify-between gap-8 p-8 sm:flex-row sm:p-12">
          <div className="relative z-10 text-center sm:text-left">
            <p className="mb-2 text-xs font-black tracking-[0.3em] text-emerald-500 uppercase">
              Batting Team
            </p>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              {currentInning?.battingTeam.name}
            </h2>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 sm:items-end">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900 dark:text-white">
                {currentInning?.runs}
              </span>
              <span className="text-3xl font-bold text-slate-400">/{currentInning?.wickets}</span>
            </div>
            <div className="flex items-center gap-2 font-[urbanist] text-sm font-bold tracking-widest text-slate-500 uppercase">
              <Target className="h-4 w-4 text-emerald-500" />
              <span>
                {currentInning?.overs}.{currentInning?.balls % 6} Overs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left/Main Column: Batting */}
        <div className="space-y-8 lg:col-span-2">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-950">
                <Sword className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase dark:text-white">
                Batting Performance
              </h3>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-4">Batsman</th>
                      <th className="px-4 py-4 text-center">R</th>
                      <th className="px-4 py-4 text-center">B</th>
                      <th className="hidden px-4 py-4 text-center sm:table-cell">4s</th>
                      <th className="hidden px-4 py-4 text-center sm:table-cell">6s</th>
                      <th className="px-4 py-4 text-center text-emerald-600">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {battedPlayers.map((batsman, i) => (
                      <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900 uppercase dark:text-white">
                            {batsman.player.user.name}
                          </p>
                          <p className="mt-1 text-[10px] font-medium text-slate-400 italic">
                            {isLoadingWickets
                              ? "Checking..."
                              : wicketsMap?.[batsman.playerId] || "Not out"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center text-base font-black text-slate-900 dark:text-white">
                          {batsman.runs}
                        </td>
                        <td className="px-4 py-4 text-center text-sm font-medium text-slate-500">
                          {batsman.balls}
                        </td>
                        <td className="hidden px-4 py-4 text-center text-sm font-medium text-slate-400 sm:table-cell">
                          {batsman.fours}
                        </td>
                        <td className="hidden px-4 py-4 text-center text-sm font-medium text-slate-400 sm:table-cell">
                          {batsman.sixes}
                        </td>
                        <td className="px-4 py-4 text-center text-sm font-black text-emerald-600">
                          {getStrikeRate(batsman.runs, batsman.balls)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {didNotBatPlayers.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                  <UserCircle2 className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase">
                  Did Not Bat
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
                {didNotBatPlayers.map((p, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-400"
                  >
                    {p.player.user.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Bowling */}
        <div className="space-y-8">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-950">
                <Flame className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase dark:text-white">
                Bowling Figures
              </h3>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-4">Bowler</th>
                    <th className="px-4 py-4 text-center">O</th>
                    <th className="px-4 py-4 text-center">W</th>
                    <th className="px-4 py-4 text-center">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {currentInning?.InningBowling.filter((b) => b.balls > 0).map((bowler, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 uppercase dark:text-white">
                          {bowler.player.user.name}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
                        {bowler.overs}.{bowler.balls % 6}
                      </td>
                      <td className="px-4 py-4 text-center text-base font-black text-emerald-600">
                        {bowler.wickets}
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-slate-400">
                        {getEcon(bowler.runs, bowler.balls)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
