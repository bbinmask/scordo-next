"use client";

import Spinner from "@/components/Spinner";
import { CurrentOverBalls, InningDetails, MatchWithDetails } from "@/lib/types";
import {
  getBallLabel,
  getCRR,
  getEcon,
  getPartnership,
  getStrikeRate,
} from "@/utils/helper/scorecard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Flame, Target } from "lucide-react";
import { useState } from "react";
import { ControlPad } from "./ControlPad";
import ScorecardModal from "./modals/ScorecardModal";
import { useChannel } from "ably/react";

export const LiveScorecard = ({
  match,
  userId,
  innings,
}: {
  match: MatchWithDetails;
  innings?: InningDetails[];
  userId?: string;
}) => {
  const queryClient = useQueryClient();
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);

  const { data: ballHistory, isLoading: historyLoading } = useQuery<CurrentOverBalls[]>({
    queryKey: ["current-over-history", innings?.at(innings?.length - 1 || 0)?.id],
    queryFn: async () => {
      if (!innings || innings.length === 0) return [];

      const { data } = await axios.get(
        `/api/matches/innings/${innings[innings.length - 1].id}/balls/current-over`
      );

      if (!data.success) return [];

      return data.data;
    },
    enabled: !!(innings?.length && innings.length > 0),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: runsLeft } = useQuery<string | null>({
    queryKey: ["runs-left", match.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${match.id}/target`);

      if (!data.success) return null;

      return data.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const channelName = `match:${match.id}`;

  useChannel(channelName, "ball-added", async (msg) => {
    await queryClient.refetchQueries({
      queryKey: ["match", match.id],
    });

    await queryClient.refetchQueries({
      queryKey: ["match-innings", match.id],
    });

    const lastInningId = innings?.at(innings.length - 1)?.id;

    if (lastInningId) {
      await queryClient.refetchQueries({
        queryKey: ["current-over-history", lastInningId],
      });
    }

    queryClient.invalidateQueries({ queryKey: ["check-bowler-change"] });

    await queryClient.refetchQueries({
      queryKey: ["runs-left", match.id],
    });
  });

  if (!innings) return null;
  const length = innings.length === 0 ? 0 : innings.length - 1;

  return (
    <>
      {/* Live Header Banner */}

      <div className="group relative mb-4 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 font-[inter] shadow-xl dark:border-white/10 dark:bg-slate-900">
        <div
          className={`absolute top-8 right-6 flex max-w-fit items-center justify-evenly rounded-full border ${match.status === "in_progress" || match.status === "inning_completed" ? "border-red-500/20 bg-red-500/10" : "border-teal-500/20 bg-teal-500/10"} px-1 py-0.5`}
        >
          {match.status === "in_progress" || match.status === "inning_completed" ? (
            <div className="mr-0.5 h-1 w-1 animate-pulse rounded-full bg-red-500" />
          ) : null}
          <span
            className={`text-[8px] font-bold ${match.status === "in_progress" || match.status === "inning_completed" ? "text-red-500" : "text-teal-800"} uppercase`}
          >
            {match.status === "in_progress" || match.status === "inning_completed"
              ? "Live"
              : match.status === "completed"
                ? "Completed"
                : "Stopped"}
          </span>
        </div>

        <div className="relative mb-6">
          <p className="mb-1 text-[10px] font-bold tracking-wide text-indigo-100 uppercase">
            Scordo Match
          </p>
          <div className="flex items-center gap-3">
            <h2 className="primary-heading pr-2 text-4xl font-black uppercase italic">
              {String(innings[length].battingTeam.abbreviation)}
            </h2>
            <span className="font-bold text-indigo-300 italic">vs</span>
            <span className="text-lg font-medium text-indigo-200 uppercase">
              {String(innings[length].bowlingTeam.abbreviation)}
            </span>
          </div>
        </div>

        <div className="relative flex items-baseline justify-between gap-3">
          <div className="">
            <span className="text-8xl font-black tracking-tighter drop-shadow-lg">
              {innings[length].runs}
            </span>
            <span className="text-4xl font-light tracking-tighter text-indigo-200">
              / {innings[length].wickets}
            </span>
          </div>

          {runsLeft && match.status !== "completed" && (
            <p className="text-xs text-wrap text-green-500">{runsLeft}</p>
          )}
          {match.status === "completed" && (
            <p className="text-xs text-wrap text-green-500">{match.result}</p>
          )}
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-green-700/5 p-4 backdrop-blur-sm">
            <span className="mb-1 block text-[10px] font-black tracking-widest text-green-300 uppercase">
              Overs
            </span>
            <p className="font-[poppins] text-2xl font-bold">
              {String(innings[length].overs)}.{String(innings[length].balls % 6)}{" "}
              <span className="text-sm opacity-40">/ {String(match.overs)}</span>
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-green-700/5 p-4 backdrop-blur-sm">
            <div className="">
              <span className="mb-1 block text-[10px] font-black tracking-widest text-indigo-300 uppercase">
                CRR
              </span>
              <p className="font-[poppins] text-2xl font-bold tracking-tighter text-emerald-400">
                {String(getCRR(innings[length].runs, innings[length].balls))}
              </p>
            </div>

            {innings[length].inningNumber === 2 && (
              <div className="">
                <span className="mb-1 block text-[10px] font-black tracking-widest text-indigo-300 uppercase">
                  RR
                </span>
                <p className="font-mono text-2xl font-black tracking-tighter text-emerald-400">
                  {String(getCRR(innings[length].runs, innings[length].balls))}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 font-[poppins] lg:grid-cols-2">
        {/* Batting Table */}
        <div className="border-input overflow-hidden rounded-[2.5rem] border bg-white shadow-sm dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
              <Target className="h-4 w-4 text-green-500" /> Batting
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              {innings[length].battingTeam.name}
            </span>
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
                {innings[length].InningBatting.filter(
                  (batsman) =>
                    (batsman.playerId === innings[length].currentStrikerId && !batsman.isOut) ||
                    (batsman.playerId === innings[length].currentNonStrikerId && !batsman.isOut)
                ).map((batsman, i) => (
                  <tr
                    key={i}
                    className={`${batsman.playerId === innings[length].currentStrikerId ? "bg-green-500/5" : ""}`}
                  >
                    <td className="px-6 py-4 font-[poppins]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
                          {batsman?.player.user.name}
                        </span>
                        {batsman.playerId === innings[length].currentStrikerId && (
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-900 dark:text-white">
                      {batsman.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {batsman.balls}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {batsman.fours}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {batsman.sixes}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-semibold text-green-500">
                      {getStrikeRate(batsman.runs, batsman.balls)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling Table */}
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
              <Flame className="h-4 w-4 text-green-500" /> Bowling
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              {innings[length].bowlingTeam.name}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-semibold tracking-widest text-slate-400 uppercase dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3">Bowler</th>
                  <th className="px-4 py-3 text-center">O</th>
                  <th className="px-4 py-3 text-center">M</th>
                  <th className="px-4 py-3 text-center">R</th>
                  <th className="px-4 py-3 text-center">W</th>
                  <th className="px-4 py-3 text-center">E</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-[urbanist] dark:divide-white/5">
                {innings[length].InningBowling.filter(
                  (batsman) => batsman.playerId === innings[length].currentBowlerId
                ).map((player, i) => (
                  <tr key={i} className={`bg-green-500/5`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
                          {player.player.user.name}
                        </span>
                        {/* {player.current && (
                        <Activity className="h-3 w-3 animate-pulse text-green-500" />
                        )} */}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {`${player.overs} ${player.balls % 6 === 0 ? "" : "." + (player.balls % 6)}`}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                      {player.maidens}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                      {player.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-green-500">
                      {player.wickets}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-semibold text-slate-400">
                      {getEcon(player.runs, player.balls)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <button
          onClick={() => setIsScorecardOpen(true)}
          className="center flex w-full max-w-40 flex-1 gap-1 rounded-2xl bg-slate-900 px-8 py-4 font-[inter] text-white shadow-xl transition-all active:scale-95 dark:bg-white dark:text-slate-900"
        >
          <span className="text-xs font-black uppercase">Scorecard</span>
        </button>
        <div className="flex w-full flex-col items-end gap-1 md:w-auto">
          <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Partnership: {getPartnership(innings[length].ballsData)}
          </p>
          <div className="flex gap-2">
            {historyLoading ? (
              <Spinner />
            ) : (
              ballHistory?.map((ball, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black dark:border-transparent ${
                    ball.isWicket
                      ? "border-red-600 bg-red-500 text-white"
                      : ball.runs === 4 || ball.runs === 6
                        ? "border-emerald-600 bg-emerald-500 text-white"
                        : "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  {getBallLabel(ball)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {match.status === "in_progress" &&
        match.matchOfficials.findIndex((official) => official.userId === userId) !== -1 && (
          <ControlPad match={match} innings={innings[length]} />
        )}
      <ScorecardModal
        isOpen={isScorecardOpen}
        innings={innings}
        onClose={() => setIsScorecardOpen(false)}
      />
    </>
  );
};
