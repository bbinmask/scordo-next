"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Flame, Gavel, ChevronRight, ChevronLeft, CheckCircle2, Rocket } from "lucide-react";
import type { QuickMatch, QuickToss } from "@/types/quick-match.props";

interface FormValues {
  tossWinnerId: string;
  tossDecision: "BAT" | "BOWL";
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
}

interface QuickInitializeModalProps {
  isOpen: boolean;
  match: QuickMatch;
  onConfirm: (params: {
    toss: QuickToss;
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    battingTeamId: string;
    bowlingTeamId: string;
  }) => void;
  onClose: () => void;
}

export function QuickInitializeModal({
  isOpen,
  match,
  onConfirm,
  onClose,
}: QuickInitializeModalProps) {
  const [step, setStep] = useState(1);

  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      tossWinnerId: "",
      tossDecision: "BAT",
      strikerId: "",
      nonStrikerId: "",
      bowlerId: "",
    },
  });

  const tossWinnerId = watch("tossWinnerId");
  const tossDecision = watch("tossDecision");
  const strikerId = watch("strikerId");
  const nonStrikerId = watch("nonStrikerId");

  if (!isOpen) return null;

  // Determine batting / bowling teams from toss
  const battingTeamId = (() => {
    if (!tossWinnerId) return "";
    const winnerIsA = tossWinnerId === match.teamA.id;
    if (tossDecision === "BAT") return winnerIsA ? match.teamA.id : match.teamB.id;
    return winnerIsA ? match.teamB.id : match.teamA.id;
  })();
  const bowlingTeamId = battingTeamId === match.teamA.id ? match.teamB.id : match.teamA.id;

  const battingTeam = match.teamA.id === battingTeamId ? match.teamA : match.teamB;
  const bowlingTeam = match.teamA.id === bowlingTeamId ? match.teamA : match.teamB;

  const onSubmit = (data: FormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    onConfirm({
      toss: { winnerId: data.tossWinnerId, decision: data.tossDecision },
      strikerId: data.strikerId,
      nonStrikerId: data.nonStrikerId,
      bowlerId: data.bowlerId,
      battingTeamId,
      bowlingTeamId,
    });
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
      <div className="animate-in zoom-in relative w-full max-w-md overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-600 p-3 shadow-lg shadow-emerald-500/30">
              {step === 1 ? (
                <Gavel className="h-6 w-6 text-white" />
              ) : (
                <Rocket className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="heading-md">{step === 1 ? "Toss" : "Opening Players"}</h2>
              <p className="label-xs text-emerald-500">Step {step} of 2</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8 pt-4">
          {step === 1 && (
            <>
              <div>
                <label className="label-field">Toss Winner</label>
                <select {...register("tossWinnerId", { required: true })} className="field-input">
                  <option value="">Select winner</option>
                  <option value={match.teamA.id}>{match.teamA.name}</option>
                  <option value={match.teamB.id}>{match.teamB.name}</option>
                </select>
              </div>

              <div>
                <label className="label-field">Elected to</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["BAT", "BOWL"] as const).map((d) => {
                    const active = tossDecision === d;
                    return (
                      <label
                        key={d}
                        className={`flex cursor-pointer items-center justify-center rounded-2xl border-2 py-4 text-sm font-black tracking-widest uppercase transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : "border-slate-200 text-slate-400 hover:border-emerald-300 dark:border-white/10"
                        }`}
                      >
                        <input
                          {...register("tossDecision")}
                          type="radio"
                          value={d}
                          className="sr-only"
                        />
                        {d === "BAT" ? "🏏 Bat" : "🎳 Bowl"}
                      </label>
                    );
                  })}
                </div>
              </div>

              {tossWinnerId && battingTeamId && (
                <div className="inner-card flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="text-emerald-500">{battingTeam.name}</span> will bat first.{" "}
                    <span className="text-slate-400">{bowlingTeam.name}</span> will bowl.
                  </p>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              {/* Striker */}
              <div>
                <label className="label-field">
                  <Flame className="mr-1 inline h-3 w-3 text-amber-500" />
                  Striker (Opening Batsman)
                </label>
                <select {...register("strikerId", { required: true })} className="field-input">
                  <option value="">Select striker</option>
                  {battingTeam.players
                    .filter((p) => p.id !== nonStrikerId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Non-striker */}
              <div>
                <label className="label-field">Non-striker</label>
                <select {...register("nonStrikerId", { required: true })} className="field-input">
                  <option value="">Select non-striker</option>
                  {battingTeam.players
                    .filter((p) => p.id !== strikerId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Bowler */}
              <div>
                <label className="label-field">Opening Bowler</label>
                <select {...register("bowlerId", { required: true })} className="field-input">
                  <option value="">Select bowler</option>
                  {bowlingTeam.players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={step === 1 ? onClose : () => setStep(1)}
              className="ghost-btn flex items-center gap-1"
            >
              {step === 1 ? (
                "Cancel"
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" /> Back
                </>
              )}
            </button>
            <button
              type="submit"
              className="primary-btn flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black tracking-widest uppercase"
            >
              {step === 1 ? (
                <>
                  Next <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Start Match
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
