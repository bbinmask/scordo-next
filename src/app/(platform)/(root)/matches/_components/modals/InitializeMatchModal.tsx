"use client";

import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MatchWithTeamAndOfficials } from "@/lib/types";
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
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface InitializeMatchForm {
  tossWinnerId: string;
  tossDecision: "BAT" | "BOWL";
  teamAActiveIds: string[];
  teamBActiveIds: string[];
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
}

export const InitializeMatchModal = ({
  isOpen,
  onClose,
  match,
}: {
  isOpen: boolean;
  onClose: () => void;
  match: MatchWithTeamAndOfficials;
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<InitializeMatchForm>({
    defaultValues: {
      tossWinnerId: "",
      tossDecision: "BAT",
      teamAActiveIds: [],
      teamBActiveIds: [],
      strikerId: "",
      nonStrikerId: "",
      bowlerId: "",
    },
    mode: "onChange",
  });

  const formData = watch();

  // Determine who bats and bowls based on toss
  const battingTeam = useMemo(() => {
    if (!formData.tossWinnerId) return null;
    const isWinnerA = formData.tossWinnerId === match.teamA.id;
    if (formData.tossDecision === "BAT") return isWinnerA ? match.teamA : match.teamB;
    return isWinnerA ? match.teamB : match.teamA;
  }, [formData.tossWinnerId, formData.tossDecision, match]);

  const bowlingTeam = useMemo(() => {
    if (!battingTeam) return null;
    return battingTeam.id === match.teamA.id ? match.teamB : match.teamA;
  }, [battingTeam, match]);

  const activeBattingPlayers = useMemo(() => {
    if (!battingTeam) return [];
    const activeIds =
      battingTeam.id === match.teamA.id ? formData.teamAActiveIds : formData.teamBActiveIds;
    return battingTeam.players.filter((p) => activeIds.includes(p.userId));
  }, [battingTeam, formData.teamAActiveIds, formData.teamBActiveIds]);

  const activeBowlingPlayers = useMemo(() => {
    if (!bowlingTeam) return [];
    const activeIds =
      bowlingTeam.id === match.teamA.id ? formData.teamAActiveIds : formData.teamBActiveIds;
    return bowlingTeam.players.filter((p) => activeIds.includes(p.userId));
  }, [bowlingTeam, formData.teamAActiveIds, formData.teamBActiveIds]);

  const onSubmit = async (data: InitializeMatchForm) => {
    setIsSubmitting(true);
    console.log("Scordo Engine Init Payload:", data);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const togglePlayer = (team: "A" | "B", playerId: string) => {
    const field = team === "A" ? "teamAActiveIds" : "teamBActiveIds";
    const current = formData[field];
    if (current.includes(playerId)) {
      setValue(
        field,
        current.filter((id) => id !== playerId)
      );
    } else if (current.length < match.playerLimit) {
      setValue(field, [...current, playerId]);
    }
  };

  console.log({ teamA: formData?.teamAActiveIds, teamB: formData?.teamBActiveIds });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0">
        <DialogHeader className="flex shrink-0 items-start bg-gradient-to-br from-green-500/10 to-transparent p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-600 p-3 shadow-lg shadow-green-500/20">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <DialogTitle className="font-[cal_sans] text-xl font-bold text-slate-900 uppercase italic dark:text-white">
                Start the Match
              </DialogTitle>
              <DialogDescription className="font-[inter] text-xs font-bold tracking-wide text-green-500 uppercase">
                Step {step} of 3
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="hide_scrollbar max-h-[48vh] flex-1 overflow-y-auto px-6 py-4 font-[poppins]">
          <form id="init-form" onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1: TOSS DATA */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right-4 space-y-8 duration-300">
                <div className="flex items-center gap-3">
                  <Gavel className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-[poppins] text-lg font-bold uppercase italic">
                    Toss Protocol
                  </h3>
                </div>

                <div className="space-y-6">
                  <>
                    <label className="mb-3 ml-1 block text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Who won the toss?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: match.teamA.id, logo: match.teamA.logo, name: match.teamA.name },
                        { id: match.teamB.id, logo: match.teamB.logo, name: match.teamB.name },
                      ].map((team) => (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => setValue("tossWinnerId", team.id)}
                          className={`flex flex-col items-center gap-3 rounded-[2rem] border-2 p-6 transition-all ${
                            formData.tossWinnerId === team.id
                              ? "border-emerald-500 bg-emerald-500/5 shadow-xl"
                              : "border-slate-100 bg-slate-50 hover:border-slate-300 dark:border-white/5 dark:bg-white/5"
                          }`}
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-white/10">
                            <img
                              src={team?.logo || undefined}
                              className="h-full w-full object-cover"
                              alt={team.name}
                            />
                          </div>
                          <span className="text-xs font-semibold tracking-wide text-slate-900 uppercase dark:text-white">
                            {team.name}
                          </span>
                          {formData.tossWinnerId === team.id && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>

                  {formData.tossWinnerId && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className="mb-3 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        The Decision
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {["BAT", "BOWL"].map((decision) => (
                          <button
                            key={decision}
                            type="button"
                            onClick={() => setValue("tossDecision", decision as any)}
                            className={`flex items-center justify-center gap-3 rounded-2xl border p-4 text-xs font-black tracking-widest uppercase transition-all ${
                              formData.tossDecision === decision
                                ? "border-emerald-500 bg-emerald-500/20 shadow-xl"
                                : "border-slate-100 bg-slate-50 hover:border-slate-300 dark:border-white/5 dark:bg-white/5"
                            }`}
                          >
                            {decision === "BAT" ? (
                              <Sword className="h-4 w-4" />
                            ) : (
                              <Flame className="h-4 w-4" />
                            )}
                            {decision}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: SQUAD SELECTION */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 space-y-8 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-bold tracking-tight uppercase italic">
                      Select Players
                    </h3>
                  </div>
                  <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-500 uppercase">
                    Limit: {match.playerLimit}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Team A List */}
                  <div className="space-y-4">
                    <p className="flex justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      {match.teamA.abbreviation}{" "}
                      <span>
                        {formData.teamAActiveIds.length}/{match.playerLimit}
                      </span>
                    </p>
                    <div className="custom-scrollbar max-h-64 space-y-1 overflow-y-auto pr-2">
                      {match.teamA.players
                        .filter(
                          (pl) => !formData.teamBActiveIds.some((userId) => pl.userId === userId)
                        )
                        .map((p) => (
                          <button
                            key={p.userId}
                            type="button"
                            onClick={() => togglePlayer("A", p.userId)}
                            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                              formData.teamAActiveIds.includes(p.userId)
                                ? "border-teal-500 bg-teal-500/10 text-teal-600"
                                : "border-slate-100 bg-slate-50 text-slate-400 dark:border-white/5 dark:bg-white/5"
                            }`}
                          >
                            <span className="truncate text-[10px] font-bold uppercase">
                              {p.user.name}
                            </span>
                            {formData.teamAActiveIds.includes(p.userId) && (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Team B List */}
                  <div className="space-y-4">
                    <p className="flex justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      {match.teamB.abbreviation}{" "}
                      <span>
                        {formData.teamBActiveIds.length}/{match.playerLimit}
                      </span>
                    </p>
                    <div className="custom-scrollbar max-h-64 space-y-1 overflow-y-auto pr-2">
                      {match.teamB.players
                        .filter(
                          (pl) => !formData.teamAActiveIds.some((userId) => pl.userId === userId)
                        )
                        .map((p) => (
                          <button
                            key={p.userId}
                            type="button"
                            onClick={() => togglePlayer("B", p.userId)}
                            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                              formData.teamBActiveIds.includes(p.userId)
                                ? "border-yellow-500 bg-yellow-500/10 text-yellow-600"
                                : "border-slate-100 bg-slate-50 text-slate-400 dark:border-white/5 dark:bg-white/5"
                            }`}
                          >
                            <span className="truncate text-[10px] font-bold uppercase">
                              {p.user.name}
                            </span>
                            {formData.teamBActiveIds.includes(p.userId) && (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Select Openers */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-4 space-y-8 duration-300">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-black tracking-tight uppercase italic">
                    Select Openers
                  </h3>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Zap className="h-24 w-24" />
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Opening Striker ({battingTeam?.abbreviation})
                        </label>
                        <select
                          required
                          value={formData.strikerId}
                          onChange={(e) => setValue("strikerId", e.target.value)}
                          className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="" className="bg-slate-900 text-slate-400">
                            Choose Batter
                          </option>
                          {activeBattingPlayers.map((p) => (
                            <option key={p.userId} value={p.userId} className="bg-slate-900">
                              {p.user.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Non-Striker
                        </label>
                        <select
                          required
                          value={formData.nonStrikerId}
                          onChange={(e) => setValue("nonStrikerId", e.target.value)}
                          className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="" className="bg-slate-900 text-slate-400">
                            Choose Batter
                          </option>
                          {activeBattingPlayers
                            .filter((p) => p.userId !== formData.strikerId)
                            .map((p) => (
                              <option key={p.userId} value={p.userId} className="bg-slate-900">
                                {p.user.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        Opening Bowler ({bowlingTeam?.abbreviation})
                      </label>
                      <select
                        required
                        value={formData.bowlerId}
                        onChange={(e) => setValue("bowlerId", e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="" className="bg-slate-900 text-slate-400">
                          Choose Bowler
                        </option>
                        {activeBowlingPlayers.map((p) => (
                          <option key={p.userId} value={p.userId} className="bg-slate-900">
                            {p.user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-3xl border border-green-500/20 bg-green-500/5 p-6">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <p className="text-xs leading-relaxed font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                    Ready for the match. Starting this match will finalize the toss and set the{" "}
                    <span className="font-bold text-green-500 underline">LIVE</span> status for all
                    spectators.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="group center flex w-full gap-2 rounded-2xl bg-slate-300 px-6 py-4 text-center font-[urbanist] text-xs font-bold uppercase transition-all dark:bg-slate-700 dark:text-slate-300"
          >
            {step === 1 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 transition-all duration-500 group-hover:-translate-x-2" />{" "}
                Back
              </>
            )}
          </button>

          {step < 3 ? (
            <button
              type="button"
              disabled={
                (step === 1 && !formData.tossWinnerId) ||
                (step === 2 &&
                  (formData.teamAActiveIds.length === 0 || formData.teamBActiveIds.length === 0))
              }
              onClick={() => setStep(step + 1)}
              className="group primary-btn center flex w-full gap-2 rounded-2xl px-8 py-4 font-[urbanist] text-xs font-black tracking-widest uppercase shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              Next{" "}
              <ChevronRight className="h-4 w-4 transition-all duration-500 group-hover:translate-x-2" />
            </button>
          ) : (
            <button
              form="init-form"
              type="submit"
              disabled={
                isSubmitting || !formData.strikerId || !formData.nonStrikerId || !formData.bowlerId
              }
              className="center group primary-btn flex gap-3 rounded-2xl px-12 py-4 text-center text-xs tracking-wide uppercase shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Starting..." : "Start"}
              {!isSubmitting && (
                <ChevronRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
              )}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InitializeMatchModal;
