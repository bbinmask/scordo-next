"use client";
// src/app/(platform)/(root)/matches/quick-match/_components/QuickNextInningModal.tsx
//
// Selects the opening players for the second innings.
// Mirrors StartNextInningModal layout but reads from QuickTeam (local) instead
// of fetching /api/matches/[id]/next-inning-players.

import { useForm } from "react-hook-form";
import { Flame, Rocket, ChevronLeft } from "lucide-react";
import type { QuickMatch } from "@/types/quick-match";

interface FormValues {
  strikerId:    string;
  nonStrikerId: string;
  bowlerId:     string;
}

interface QuickNextInningModalProps {
  isOpen: boolean;
  match: QuickMatch;
  onConfirm: (params: { strikerId: string; nonStrikerId: string; bowlerId: string }) => void;
  onClose: () => void;
}

export function QuickNextInningModal({
  isOpen,
  match,
  onConfirm,
  onClose,
}: QuickNextInningModalProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { strikerId: "", nonStrikerId: "", bowlerId: "" },
  });

  if (!isOpen) return null;

  // Teams swap for the second innings:
  // whoever bowled in inning 1 now bats, whoever batted now bowls.
  const firstInning   = match.innings[0];
  const newBattingId  = firstInning?.bowlingTeamId ?? match.teamB.id;
  const newBowlingId  = firstInning?.battingTeamId ?? match.teamA.id;

  const battingTeam  = match.teamA.id === newBattingId ? match.teamA : match.teamB;
  const bowlingTeam  = match.teamA.id === newBowlingId ? match.teamA : match.teamB;

  const target = firstInning ? firstInning.runs + 1 : null;

  const strikerId    = watch("strikerId");
  const nonStrikerId = watch("nonStrikerId");

  const onSubmit = (data: FormValues) => onConfirm(data);

  return (
    <div className="animate-in fade-in fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
      <div className="animate-in zoom-in relative w-full max-w-md overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-600 p-3 shadow-lg shadow-emerald-500/30">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="heading-md">2nd Innings</h2>
              <p className="label-xs text-emerald-500">
                {battingTeam.name} need{target ? ` ${target} to win` : " to bat"}
              </p>
            </div>
          </div>
        </div>

        {/* Target chip */}
        {target && (
          <div className="mx-8 mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="label-sm text-emerald-600">
              Target: <span className="text-lg font-black">{target}</span>
            </p>
            <p className="meta-text text-[10px]">
              {battingTeam.name} must score {target} runs to win
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-8 pt-5">

          {/* Striker */}
          <div>
            <label className="label-field">
              <Flame className="mr-1 inline h-3 w-3 text-amber-500" />
              Opening Striker — {battingTeam.name}
            </label>
            <select
              {...register("strikerId", { required: "Select striker" })}
              className="field-input"
            >
              <option value="">Select striker</option>
              {battingTeam.players
                .filter((p) => p.id !== nonStrikerId)
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            {errors.strikerId && <p className="field-error">{errors.strikerId.message}</p>}
          </div>

          {/* Non-striker */}
          <div>
            <label className="label-field">Non-striker</label>
            <select
              {...register("nonStrikerId", { required: "Select non-striker" })}
              className="field-input"
            >
              <option value="">Select non-striker</option>
              {battingTeam.players
                .filter((p) => p.id !== strikerId)
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            {errors.nonStrikerId && <p className="field-error">{errors.nonStrikerId.message}</p>}
          </div>

          {/* Bowler */}
          <div>
            <label className="label-field">Opening Bowler — {bowlingTeam.name}</label>
            <select
              {...register("bowlerId", { required: "Select bowler" })}
              className="field-input"
            >
              <option value="">Select bowler</option>
              {bowlingTeam.players.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.bowlerId && <p className="field-error">{errors.bowlerId.message}</p>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={onClose} className="ghost-btn flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Cancel
            </button>
            <button
              type="submit"
              className="primary-btn flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest"
            >
              <Rocket className="h-4 w-4" />
              Start 2nd Innings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
