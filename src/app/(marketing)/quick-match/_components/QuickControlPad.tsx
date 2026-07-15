"use client";
// src/app/(platform)/(root)/matches/quick-match/_components/QuickControlPad.tsx

import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, Undo2 } from "lucide-react";
import { WicketType } from "@/generated/prisma";
import { getBallLabel, getOvers } from "@/utils/helper/scorecard";
import { getBallClassesFromLabel } from "@/utils/helper/classes";
import type { QuickMatch, QuickInning, QuickBall } from "@/types/quick-match.props";
import type { UseQuickMatchReturn } from "@/hooks/useQuickMatch";
import type { FallWicket } from "@/types/match.props";

import WicketDetailsModal from "@/app/(platform)/(root)/matches/_components/modals/WicketDetailsModal";
import { SelectBowlerModal } from "@/app/(platform)/(root)/matches/_components/modals/SelectBowlerModal";

type ExtraType = "wd" | "nb" | "b" | "lb";

interface QuickControlPadProps {
  match: QuickMatch;
  inning: QuickInning;
  hook: UseQuickMatchReturn;
}

export function QuickControlPad({ match, inning, hook }: QuickControlPadProps) {
  const [extras, setExtras] = useState({
    isWide: false,
    isBye: false,
    isLegBye: false,
    isNB: false,
  });
  const [isWicket, setIsWicket] = useState(false);

  const { scoreBall, undoBall, isSubmitting, changeBowler, isOverFinished } = hook;

  // ── Player lists adapted from QuickInning shape ────────────────────────

  // WicketDetailsModal expects InningBattingDetails shape — we adapt QuickInningBatting.
  // We build minimal compatible objects: only the fields the modal actually reads.
  const battingPlayers = useMemo(() => {
    return inning.batting.map((b) => ({
      ...b,
      id: b.playerId,
      inningId: inning.id,
    }));
  }, [inning]);

  const bowlingPlayers = useMemo(
    () =>
      inning.bowling.map((b) => ({
        ...b,
        id: b.playerId,
        inningId: inning.id,
      })),
    [inning]
  );

  const playersOnCrease = useMemo(
    () =>
      battingPlayers.filter(
        (b) => b.playerId === inning.currentStrikerId || b.playerId === inning.currentNonStrikerId
      ),
    [battingPlayers, inning]
  );

  const playerLeftToBat = useMemo(
    () =>
      battingPlayers.filter(
        (b) =>
          b.playerId !== inning.currentStrikerId &&
          b.playerId !== inning.currentNonStrikerId &&
          !b.isOut
      ),
    [battingPlayers, inning]
  );

  // Available bowlers for over-end selection (exclude current bowler if consecutive)
  const availableBowlers = useMemo(
    () => bowlingPlayers.filter((b) => b.playerId !== inning.currentBowlerId),
    [bowlingPlayers, inning]
  );

  // ── Current over balls for the timeline ───────────────────────────────
  const currentOverBalls: QuickBall[] = useMemo(() => {
    const completedOvers = inning.overs;
    const overStart = completedOvers * 6;
    const overEnd = overStart + 6;
    // Balls whose legal-ball index falls in the current over
    return inning.balls_history
      .filter((b) => {
        if (!b.isWide && !b.isNoBall) {
          return b.ball > overStart && b.ball <= overEnd;
        }
        return true; // Include extras in current over display
      })
      .slice(-12); // Show max 12 balls in timeline
  }, [inning]);

  // ── Extras toggle ─────────────────────────────────────────────────────
  const handleExtras = (type: ExtraType) => {
    switch (type) {
      case "b":
        setExtras((p) => ({ ...p, isBye: !p.isBye, isLegBye: false }));
        break;
      case "wd":
        setExtras((p) => ({ ...p, isWide: !p.isWide, isNB: false, isLegBye: false }));
        break;
      case "nb":
        setExtras((p) => ({ ...p, isNB: !p.isNB, isWide: false, isLegBye: false }));
        break;
      case "lb":
        setExtras((p) => ({ ...p, isLegBye: !p.isLegBye, isBye: false }));
        break;
    }
  };

  const resetExtras = () =>
    setExtras({ isWide: false, isNB: false, isLegBye: false, isBye: false });

  // ── Ball submission ────────────────────────────────────────────────────
  const submitBall = useCallback(
    (runs: number, wicket: FallWicket | null) => {
      if (!wicket) {
        scoreBall({
          runs,
          batsmanId: inning.currentStrikerId as string,
          isBye: extras.isBye ? true : extras.isWide && runs > 0 ? true : false,
          isWide: extras.isWide,
          isLegBye: extras.isLegBye,
          isNoBall: extras.isNB,
          isWicket: false,
          isLastWicket: false,
        });
      } else if (wicket.type === "RUN_OUT") {
        scoreBall({
          runs,
          isWicket: true,
          dismissalType: "RUN_OUT",
          fielderId: wicket.fielderId,
          batsmanId: wicket.batsmanId,
          isBye: extras.isBye,
          isLegBye: extras.isLegBye,
          isNoBall: extras.isNB,
          isWide: extras.isWide,
          nextBatsmanId: wicket.nextBatsmanId as string,
          outBatsmanId: wicket.batsmanId,
          isLastWicket: match.playerLimit - 1 === inning.wickets + 1,
        });
      } else {
        scoreBall({
          runs: 0,
          isWicket: true,
          dismissalType: wicket.type,
          fielderId: wicket.fielderId,
          batsmanId: inning.currentStrikerId as string,
          outBatsmanId: inning.currentStrikerId as string,
          nextBatsmanId: wicket.nextBatsmanId as string,
          isLastWicket: match.playerLimit === inning.wickets + 2,
          isBye: extras.isBye,
          isLegBye: extras.isLegBye,
          isNoBall: extras.isNB,
          isWide: extras.isWide,
        });
      }
      resetExtras();
    },
    [scoreBall, inning, extras, match]
  );

  const onBallPress = (runs: number) => submitBall(runs, null);
  const onBall = (
    runs: number,
    wicket: {
      fielderId: string;
      batsmanId: string;
      nextBatsmanId: string | null;
      type: WicketType;
    } | null
  ) => submitBall(runs, wicket);

  return (
    <aside className="space-y-6 lg:col-span-4">
      {/* ── Scoring pad ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="label-sm font-black italic">Scoring Pad</h3>
          <button
            onClick={undoBall}
            disabled={isSubmitting || inning.balls_history.length === 0}
            className="rounded-2xl bg-slate-100 p-3 text-slate-400 transition-all hover:text-emerald-500 active:scale-90 disabled:opacity-30 dark:bg-white/5"
            title="Undo Last Ball"
          >
            <Undo2 className="h-5 w-5" />
          </button>
        </div>

        {/* Runs grid */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 6].map((num) => (
            <button
              key={num}
              onClick={() => onBallPress(num)}
              disabled={isSubmitting}
              className="flex aspect-square items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-2xl font-black shadow-sm transition-all hover:scale-105 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white active:scale-95 disabled:opacity-40 dark:border-white/5 dark:bg-white/5"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Extras & Wicket */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <PadButton
              label="WD"
              sub="Wide"
              active={extras.isWide}
              disabled={isSubmitting}
              onClick={() => handleExtras("wd")}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-4 text-[10px] font-black tracking-widest text-emerald-600 uppercase shadow-sm transition-all hover:bg-emerald-600 hover:text-white dark:text-emerald-100"
            />
            <PadButton
              label="NB"
              sub="No Ball"
              active={extras.isNB}
              disabled={isSubmitting}
              onClick={() => handleExtras("nb")}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-4 text-[10px] font-black tracking-widest text-emerald-600 uppercase shadow-sm transition-all hover:bg-emerald-600 hover:text-white dark:text-emerald-100"
            />
            <PadButton
              label="B"
              sub="Bye"
              active={extras.isBye}
              disabled={isSubmitting}
              onClick={() => handleExtras("b")}
              className="rounded-2xl border border-slate-200 bg-slate-100 py-4 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm transition-all hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            />
            <PadButton
              label="LB"
              sub="Leg bye"
              active={extras.isLegBye}
              disabled={isSubmitting}
              onClick={() => handleExtras("lb")}
              className="rounded-2xl border border-slate-200 bg-slate-100 py-4 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm transition-all hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            />

            <PadButton
              label="W"
              active={false}
              sub="Wicket"
              disabled={isSubmitting}
              className="col-span-2 flex w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-rose-500 bg-rose-600 py-6 text-white shadow-xl shadow-rose-600/30 transition-all hover:bg-rose-700 active:scale-95 dark:bg-red-800"
              onClick={() => setIsWicket(true)}
            />
          </div>
        </div>
      </div>

      {/* ── Ball timeline ─────────────────────────────────────────────── */}
      <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900 p-8 text-white shadow-xl">
        <div className="mb-6 flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-500" />
          <span className="label-xs text-emerald-500">Timeline</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {currentOverBalls.map((ball) => {
            const label = getBallLabel(ball);
            return (
              <div key={ball.id} className="relative">
                <p className="absolute -top-4 font-[poppins] text-[8px] font-normal">
                  {getOvers(Math.floor(ball.ball / 6), ball.ball)} Overs
                </p>
                <p
                  className={`${getBallClassesFromLabel(label)} relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-[poppins] text-[10px] font-black`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modals (reused from authenticated system) ─────────────────── */}
      <WicketDetailsModal
        isSubmitting={isSubmitting}
        fielders={bowlingPlayers}
        batsmanOnCrease={playersOnCrease}
        playersLeftToBat={playerLeftToBat}
        isOpen={isWicket}
        onClose={() => setIsWicket(false)}
        onConfirm={onBall}
      />

      <SelectBowlerModal
        isSaving={false}
        bowlers={availableBowlers}
        isOpen={isOverFinished && match.status !== "inning_completed"}
        onSubmit={changeBowler}
      />
    </aside>
  );
}

// ─── PadButton (identical to ControlPad.tsx) ──────────────────────────────

const PadButton = ({
  label,
  sub,
  onClick,
  disabled,
  active,
  className,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
  disabled: boolean;
  active?: boolean;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "relative flex flex-col items-center justify-center rounded-2xl p-4 text-2xl font-black transition-all ease-in-out",
      className,
      active && "!bg-emerald-500"
    )}
  >
    <span className="text-lg font-bold">{label}</span>
    {sub && (
      <span className="text-[8px] font-semibold tracking-wide uppercase opacity-70">{sub}</span>
    )}
  </button>
);
