"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Flame, LayoutList, Star, Sword } from "lucide-react";
import { getStrikeRate, getEcon } from "@/utils/helper/scorecard";
import type { QuickMatch, QuickInningBatting } from "@/types/quick-match.props";

interface QuickScorecardModalProps {
  isOpen: boolean;
  match: QuickMatch;
  onClose: () => void;
}

export function QuickScorecardModal({ isOpen, match, onClose }: QuickScorecardModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const innings = match.innings;

  const inning = innings[activeIdx];
  const battingTeam = match.teamA.id === inning.battingTeamId ? match.teamA : match.teamB;
  const bowlingTeam = match.teamA.id === inning.bowlingTeamId ? match.teamA : match.teamB;

  const extras = useMemo(() => {
    const balls = inning.balls_history;
    return {
      wides: balls.filter((b) => b.isWide).reduce((s, b) => s + b.runs + 1, 0),
      noBalls: balls.filter((b) => b.isNoBall).reduce((s, b) => s + b.runs + 1, 0),
      byes: balls.filter((b) => b.isBye).reduce((s, b) => s + b.runs, 0),
      legByes: balls.filter((b) => b.isLegBye).reduce((s, b) => s + b.runs, 0),
    };
  }, [inning]);

  const totalExtras = extras.wides + extras.noBalls + extras.byes + extras.legByes;

  const dismissalMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const ball of inning.balls_history) {
      if (!ball.isWicket) continue;
      const bowlerName =
        inning.bowling.find((b) => b.playerId === ball.bowlerId)?.player.user.name ?? "?";
      const fielderName = ball.fielderId
        ? (inning.bowling.find((b) => b.playerId === ball.fielderId)?.player.user.name ??
          inning.batting.find((b) => b.playerId === ball.fielderId)?.player.user.name ??
          "?")
        : null;

      let text = "";
      switch (ball.dismissalType) {
        case "CAUGHT":
          text =
            fielderName === bowlerName ? `c&b ${bowlerName}` : `c. ${fielderName} b. ${bowlerName}`;
          break;
        case "BOWLED":
          text = `b. ${bowlerName}`;
          break;
        case "LBW":
          text = `lbw b. ${bowlerName}`;
          break;
        case "RUN_OUT":
          text = `run out${fielderName ? ` (${fielderName})` : ""}`;
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
      map[ball.batsmanId] = text;
    }
    return map;
  }, [inning]);

  const battedPlayers = inning.batting.filter(
    (b) =>
      b.isOut || b.playerId === inning.currentStrikerId || b.playerId === inning.currentNonStrikerId
  );

  const didNotBat = inning.batting.filter(
    (b) =>
      !b.isOut &&
      b.playerId !== inning.currentStrikerId &&
      b.playerId !== inning.currentNonStrikerId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-br from-green-500/10 to-transparent p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-600 p-3 shadow-lg">
              <LayoutList className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="heading-md--poppins">Full Scorecard</DialogTitle>
              <DialogDescription className="label-xs text-green-500">
                {battingTeam.name} vs {bowlingTeam.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Innings tabs */}
        {innings.length > 1 && (
          <div className="flex gap-2 border-b border-slate-100 px-6 pb-4 dark:border-white/5">
            {innings.map((inn, i) => {
              const team = match.teamA.id === inn.battingTeamId ? match.teamA : match.teamB;
              return (
                <button
                  key={inn.id}
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-xl px-4 py-2 text-xs font-black tracking-widest uppercase transition-all ${
                    activeIdx === i
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {team.abbreviation} Inns {i + 1}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-6 p-6">
          {/* ── Score summary ──────────────────────────────────────── */}
          <div className="inner-card flex items-center justify-between">
            <div>
              <p className="label-xs">{battingTeam.name}</p>
              <p className="stat-value">
                {inning.runs}/{inning.wickets}
              </p>
              <p className="meta-text text-[10px]">
                {inning.overs}.{inning.balls % 6} overs
              </p>
            </div>
            <div className="text-right">
              <p className="label-xs">Run Rate</p>
              <p className="stat-value text-xl">
                {inning.balls > 0 ? ((inning.runs / inning.balls) * 6).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>

          {/* ── Batting ───────────────────────────────────────────── */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Sword className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-black tracking-widest uppercase">Batting</h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-semibold tracking-widest text-slate-400 uppercase dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Batter</th>
                    <th className="px-3 py-3 text-center">R</th>
                    <th className="px-3 py-3 text-center">B</th>
                    <th className="px-3 py-3 text-center">4s</th>
                    <th className="px-3 py-3 text-center">6s</th>
                    <th className="px-3 py-3 text-center">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {battedPlayers.map((bat) => (
                    <BattingRow
                      key={bat.playerId}
                      bat={bat}
                      isStriker={bat.playerId === inning.currentStrikerId}
                      dismissal={bat.isOut ? dismissalMap[bat.playerId] : "not out"}
                    />
                  ))}

                  {/* Extras row */}
                  <tr className="bg-slate-50/50 dark:bg-white/2">
                    <td colSpan={5} className="px-4 py-3 text-xs font-semibold text-slate-500">
                      Extras
                      <span className="ml-2 text-[10px] text-slate-400">
                        (wd {extras.wides}, nb {extras.noBalls}, b {extras.byes}, lb{" "}
                        {extras.legByes})
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {totalExtras}
                    </td>
                  </tr>

                  {/* Total row */}
                  <tr className="bg-slate-100/60 dark:bg-white/5">
                    <td
                      colSpan={5}
                      className="px-4 py-3 text-xs font-black text-slate-900 uppercase dark:text-white"
                    >
                      Total
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-black text-slate-900 dark:text-white">
                      {inning.runs} ({inning.wickets} wkts, {inning.overs}.{inning.balls % 6} ov)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Did not bat */}
            {didNotBat.length > 0 && (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-100 px-4 py-3 dark:border-white/5">
                <p className="label-xs mb-1">Did not bat</p>
                <p className="meta-text text-[10px]">
                  {didNotBat.map((b) => b.player.user.name).join(", ")}
                </p>
              </div>
            )}
          </section>

          {/* ── Bowling ───────────────────────────────────────────── */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-black tracking-widest uppercase">Bowling</h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-semibold tracking-widest text-slate-400 uppercase dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Bowler</th>
                    <th className="px-3 py-3 text-center">O</th>
                    <th className="px-3 py-3 text-center">R</th>
                    <th className="px-3 py-3 text-center">W</th>
                    <th className="px-3 py-3 text-center">Wd</th>
                    <th className="px-3 py-3 text-center">Nb</th>
                    <th className="px-3 py-3 text-center">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-[urbanist] dark:divide-white/5">
                  {inning.bowling
                    .filter((b) => b.balls > 0 || b.wides > 0 || b.noBalls > 0)
                    .map((bowl) => (
                      <tr
                        key={bowl.playerId}
                        className={bowl.playerId === inning.currentBowlerId ? "bg-green-500/5" : ""}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
                              {bowl.player.user.name}
                            </span>
                            {bowl.playerId === inning.currentBowlerId && (
                              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center text-xs font-bold text-slate-900 dark:text-white">
                          {bowl.overs}.{bowl.balls % 6}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-slate-500">
                          {bowl.runs}
                        </td>
                        <td className="px-3 py-3 text-center text-xs font-bold text-green-500">
                          {bowl.wickets}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-slate-400">
                          {bowl.wides}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-slate-400">
                          {bowl.noBalls}
                        </td>
                        <td className="px-3 py-3 text-center text-[10px] font-semibold text-slate-400">
                          {getEcon(bowl.runs, bowl.balls)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Match result ──────────────────────────────────────── */}
          {match.status === "completed" && match.result && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
              <Star className="mx-auto mb-2 h-5 w-5 text-emerald-500" />
              <p className="label-sm font-black text-emerald-600">{match.result}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Batting row ──────────────────────────────────────────────────────────

function BattingRow({
  bat,
  isStriker,
  dismissal,
}: {
  bat: QuickInningBatting;
  isStriker: boolean;
  dismissal?: string;
}) {
  return (
    <tr className={isStriker ? "bg-green-500/5" : ""}>
      <td className="px-4 py-3 font-[poppins]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
            {bat.player.user.name}
          </span>
          {isStriker && (
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          )}
        </div>
        {dismissal && <p className="text-[10px] text-slate-400">{dismissal}</p>}
      </td>
      <td className="px-3 py-3 text-center text-xs font-bold text-slate-900 dark:text-white">
        {bat.runs}
      </td>
      <td className="px-3 py-3 text-center text-xs text-slate-500">{bat.balls}</td>
      <td className="px-3 py-3 text-center text-xs text-slate-500">{bat.fours}</td>
      <td className="px-3 py-3 text-center text-xs text-slate-500">{bat.sixes}</td>
      <td className="px-3 py-3 text-center text-[10px] font-semibold text-green-500">
        {getStrikeRate(bat.runs, bat.balls)}
      </td>
    </tr>
  );
}
