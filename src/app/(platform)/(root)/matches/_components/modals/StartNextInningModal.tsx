"use client";

import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InningBattingDetails,
  InningBowlingDetails,
  InningDetails,
  MatchWithDetails,
  PlayerWithUser,
} from "@/lib/types";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Gavel,
  Info,
  Loader2,
  Rocket,
  Sword,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { startTransition, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { type InputTypeForNextInning as InitializeMatchForm } from "@/actions/match-actions/types";
import { toast } from "sonner";
import { MatchStatus } from "@/generated/prisma";
import { startNextInning } from "@/actions/match-actions";
import { useAction } from "@/hooks/useAction";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface StartNextInningModalProps {
  isOpen: boolean;
  innings?: InningDetails[];
  onClose: () => void;
  match: MatchWithDetails;
}

export const StartNextInningModal = ({
  isOpen,
  onClose,
  innings,
  match,
}: StartNextInningModalProps) => {
  const router = useRouter();

  const { execute, isLoading: isSubmitting } = useAction(startNextInning, {
    onSuccess() {
      toast.success("Match Started");
      onClose();
      startTransition(() => {
        router.refresh();
      });
    },

    onError(error) {
      toast.error(error);
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, errors },
  } = useForm<InitializeMatchForm>({
    defaultValues: {
      matchId: match.id,
      strikerId: "",
      nonStrikerId: "",
      bowlerId: "",
    },

    mode: "onChange",
  });

  const lastBatted = innings?.at(-1)?.battingTeamId === match.teamA.id ? "teamA" : "teamB";
  const formData = watch();

  const onSubmit: SubmitHandler<InitializeMatchForm> = (data) => {
    execute(data);
  };

  const { data } = useQuery<{
    battingPlayers: InningBattingDetails[];
    bowlingPlayers: InningBowlingDetails[];
  }>({
    queryKey: ["next-inning-batting-team", match.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${match.id}/next-inning-players`);

      if (!data.success) {
        toast.error("Data not found");
        onClose();
        return null;
      }
      return data.data;
    },
  });

  if (!innings) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="flex shrink-0 items-start bg-gradient-to-br from-green-500/10 to-transparent p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-600 p-3 shadow-lg shadow-green-500/20">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <DialogTitle className="font-[cal_sans] text-xl font-bold text-slate-900 uppercase italic dark:text-white">
                Start the Match
              </DialogTitle>
              <DialogDescription className="font-[inter] text-xs font-bold tracking-wide text-green-500">
                {`Start ${innings.length + 1 === 2 ? innings.length + 1 + "nd" : innings.length + 1 === 3 ? innings.length + 1 + "rd" : innings.length + 1 + "th"} Inning`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form id="init-form" className="px-6 pt-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Select Openers */}
          <div className="animate-in slide-in-from-right-4 space-y-2 duration-300">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-black tracking-tight uppercase italic">Select Openers</h3>
            </div>

            <div className="hide_scrollbar relative max-h-[40vh] flex-1 overflow-hidden overflow-y-auto rounded-[2rem] bg-slate-900 p-8 font-[poppins] text-white">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap className="h-24 w-24" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                      Opening Striker (
                      {lastBatted === "teamA" ? match.teamB.abbreviation : match.teamA.abbreviation}
                      )
                    </label>
                    {data?.battingPlayers && (
                      <select
                        required
                        value={formData.strikerId}
                        onChange={(e) => setValue("strikerId", e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-[inter] text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="" className="bg-slate-900 text-slate-400">
                          Choose Batter
                        </option>
                        {data.battingPlayers
                          .filter((p) => p.playerId !== formData.nonStrikerId)
                          .map((p) => (
                            <option
                              key={p.id}
                              value={p.playerId}
                              className="bg-slate-900 pr-2 font-[urbanist]"
                            >
                              {p.player.user.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                      Non-Striker
                    </label>
                    {data?.battingPlayers && (
                      <select
                        required
                        value={formData.nonStrikerId}
                        onChange={(e) => setValue("nonStrikerId", e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-[inter] text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="" className="bg-slate-900 text-slate-400">
                          Choose Batter
                        </option>
                        {data.battingPlayers
                          .filter((p) => p.playerId !== formData.strikerId)
                          .filter((p) => p.id !== formData.strikerId)
                          .map((p) => (
                            <option
                              key={p.id}
                              value={p.playerId}
                              className="bg-slate-900 pr-2 font-[urbanist]"
                            >
                              {p.player.user.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Opening Bowler (
                    {lastBatted === "teamA" ? match.teamA.abbreviation : match.teamB.abbreviation})
                  </label>
                  {data?.bowlingPlayers && (
                    <select
                      required
                      value={formData.bowlerId}
                      onChange={(e) => {
                        setValue("bowlerId", e.target.value);
                      }}
                      className="fon2-[inter] w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">
                        Choose Bowler
                      </option>
                      {data?.bowlingPlayers.map((p) => (
                        <option
                          key={p.id}
                          value={p.playerId}
                          className="bg-slate-900 pr-2 font-[urbanist]"
                        >
                          {p.player.user.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-3xl border border-green-500/20 bg-green-500/5 px-4 py-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <p className="font-[urbanist] text-xs leading-relaxed font-semibold text-slate-500 dark:text-slate-400">
                Starting this inning will{" "}
                <span className="font-bold text-green-500 underline">LIVE</span> status for all
                spectators.
              </p>
            </div>
          </div>
          {/* Footer */}
          <div className="my-2 flex items-center justify-between gap-2 px-4 py-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="group center flex w-full gap-2 rounded-2xl bg-slate-300 px-6 py-4 text-center font-[urbanist] text-xs font-bold uppercase transition-all dark:bg-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              form="init-form"
              type="submit"
              disabled={
                isSubmitting || !formData.strikerId || !formData.nonStrikerId || !formData.bowlerId
              }
              className="center group primary-btn flex gap-3 rounded-2xl px-12 py-4 text-center text-xs tracking-wide uppercase shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? <>Starting...</> : <>Start</>}
              {!isSubmitting && (
                <ChevronRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartNextInningModal;
