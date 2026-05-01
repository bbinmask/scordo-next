import { cn } from "@/lib/utils";
import { Clock, Gavel, RotateCcw, Settings, Undo2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import WicketDetailsModal from "./modals/WicketDetailsModal";
import { CurrentOverBalls, InningDetails, MatchWithDetails } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { changeBowler, pushBall, undoBall } from "@/actions/match-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WicketType } from "@/generated/prisma";
import axios from "axios";
import { SelectBowlerModal } from "./modals/SelectBowlerModal";
import { useChannel } from "ably/react";
import { ShotDirectionModal } from "./modals/ShotDirectionModal";
import { useCommentaryStore } from "@/hooks/store/use-commentary";
import {
  detectBatterMilestone,
  detectHatTrick,
  detectMaidenOver,
  detectSpecialBoundaryEvents,
} from "@/lib/commentary/detector";
import { CommentaryLine, CommentaryPayload, ShotSide } from "@/lib/commentary/engine";
import { FallWicket } from "@/types/match.props";
import { isLegalBall } from "@/utils/helper/scorecard";
type ExtraType = "wd" | "nb" | "b" | "lb";

interface ControlPadProps {
  innings: InningDetails;
  match: MatchWithDetails;
}

export const ControlPad = ({ innings, match }: ControlPadProps) => {
  const queryClient = useQueryClient();

  const { execute, isLoading: isSubmitting } = useAction(pushBall, {
    onSuccess(data) {
      if ((innings.balls + 1) % 6 === 0) {
        if (data.over < match.overs && match.playerLimit > innings.wickets + 1)
          setIsOverFinished(true);
      }
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeChangeBowler, isLoading: isChanging } = useAction(changeBowler, {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["match-innings", innings.matchId] });
      queryClient.invalidateQueries({ queryKey: ["current-over-history", innings.id] });
      setIsOverFinished(false);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeUndo, isLoading: isUndoing } = useAction(undoBall, {
    onSuccess() {
      toast.success("Last ball undone");
      queryClient.invalidateQueries({
        queryKey: ["match-innings", innings.matchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["current-over-history", innings.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["check-bowler-change", innings.id],
      });
      queryClient.invalidateQueries({ queryKey: ["runs-left", match.id] });
    },
    onError(error) {
      toast.error(error);
    },
  });

  const {} = useQuery<boolean>({
    queryKey: ["check-bowler-change"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/innings/${innings.id}/check-bowler-change`);

      if (!data.success) return setIsOverFinished(false);

      setIsOverFinished(data.data && match.status !== "inning_completed");

      return data.data;
    },
  });

  const { data: history, isLoading: historyLoading } = useQuery<CurrentOverBalls[]>({
    queryKey: ["current-over-history", innings.id],
    queryFn: async () => {
      if (!innings) return [];

      const { data } = await axios.get(`/api/matches/innings/${innings.id}/balls/current-over`);

      if (!data.success) return [];

      return data.data;
    },
    enabled: !!innings,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { isEnabled, addLine, setGenerating, hasSeenKey, markKey } = useCommentaryStore();

  // ── pending ball (held while shot modal is open) ──────────────────────────
  const [pendingBall, setPendingBall] = useState<{
    runs: number;
    wicket: null | {
      fielderId: string;
      batsmanId: string;
      nextBatsmanId: string | null;
      type: WicketType;
    };
  } | null>(null);

  const onBall = (
    runs: number,
    wicket: {
      fielderId: string;
      batsmanId: string;
      nextBatsmanId: string | null;
      type: WicketType;
    } | null
  ) => {
    setPendingBall({ runs, wicket });

    // if (!wicket) {
    //   execute({
    //     matchId: innings.matchId,
    //     inningId: innings.id,
    //     runs: runs,
    //     batsmanId: innings.currentStrikerId as string,
    //     isBye: extras.isBye ? true : extras.isWide && runs > 0 ? true : false,
    //     isWide: extras.isWide,
    //     isLegBye: extras.isLegBye,
    //     isNoBall: extras.isNB,
    //     isWicket: false,
    //     isLastWicket: false,

    //   });
    // } else if (wicket.type === "RUN_OUT") {
    //   execute({
    //     matchId: innings.matchId,
    //     inningId: innings.id,
    //     runs,
    //     isWicket: true,
    //     dismissalType: "RUN_OUT",
    //     fielderId: wicket.fielderId,
    //     batsmanId: wicket.batsmanId,
    //     isBye: extras.isBye,
    //     isLegBye: extras.isLegBye,
    //     isNoBall: extras.isNB,
    //     isWide: extras.isWide,
    //     nextBatsmanId: wicket.nextBatsmanId as string,
    //     isLastWicket: match.playerLimit === innings.wickets + 2,
    //     outBatsmanId:
    //       wicket.batsmanId.trim() !== "" ? wicket.batsmanId : (innings.currentStrikerId as string),
    //   });
    // } else {
    //   execute({
    //     matchId: innings.matchId,
    //     inningId: innings.id,
    //     runs: 0,
    //     isWicket: true,
    //     dismissalType: wicket.type,
    //     fielderId: wicket.fielderId,
    //     batsmanId: innings.currentStrikerId as string,
    //     outBatsmanId: innings.currentStrikerId as string,
    //     nextBatsmanId: wicket.nextBatsmanId as string,
    //     isLastWicket: match.playerLimit === innings.wickets + 2,
    //     isBye: extras.isBye,
    //     isLegBye: extras.isLegBye,
    //     isNoBall: extras.isNB,
    //     isWide: extras.isWide,
    //   });
    // }
    resetExtras();
  };

  const handleChangeBowler = (bowlerId: string) => {
    executeChangeBowler({
      matchId: innings.matchId,
      inningId: innings.id,
      bowlerId,
    });
  };

  const isAnythingLoading = isSubmitting || isUndoing;

  const batterName = useMemo(
    () =>
      innings.InningBatting.find((b) => b.playerId === innings.currentStrikerId)?.player.user.name,
    [innings]
  );
  const bowlerName = useMemo(
    () =>
      innings.InningBowling.find((b) => b.playerId === innings.currentBowlerId)?.player.user.name,
    [innings]
  );
  const teamScore = `${innings.runs}/${innings.wickets}`;
  const overContext = `${innings.overs}.${innings.balls % 6}`;
  const [extras, setExtras] = useState({
    isWide: false,
    isBye: false,
    isLegBye: false,
    isNB: false,
  });
  const [isOverFinished, setIsOverFinished] = useState(false);
  const [isWicket, setIsWicket] = useState(false);

  const battingPlayers = useMemo(() => {
    return innings.InningBatting;
  }, [innings]);

  const bowlingPlayers = useMemo(() => {
    return innings.InningBowling;
  }, [innings]);

  const handleUndo = () => {};

  // When a run-pad button is pressed: if commentary enabled, open shot modal first
  const onBallPress = (runs: number) => {
    if (isEnabled) {
      setPendingBall({ runs, wicket: null });
    } else {
      submitBall(runs, null, null);
    }
  };

  const handleExtras = (type: ExtraType) => {
    switch (type) {
      case "b":
        setExtras((prev) => ({
          isBye: !prev.isBye,
          isLegBye: false,
          isWide: prev.isNB ? false : prev.isWide,
          isNB: prev.isWide ? false : prev.isNB,
        }));

        break;
      case "wd":
        setExtras((prev) => ({
          isBye: prev.isBye,
          isWide: !prev.isWide,
          isNB: false,
          isLegBye: false,
        }));

        break;
      case "nb":
        setExtras((prev) => ({
          isBye: prev.isBye,
          isWide: false,
          isNB: !prev.isNB,
          isLegBye: false,
        }));

        break;
    }
  };

  // ── Auto-event checks after each ball ────────────────────────────────────
  const checkAutoEvents = useCallback(
    async (runs: number, isWicket: boolean) => {
      if (!isEnabled) return;

      // Current over balls from query cache
      const overBalls = (
        queryClient.getQueryData<any[]>(["current-over-history", innings.id]) ?? []
      ).map((b) => ({
        runs: b.runs,
        isWicket: b.isWicket,
        isWide: b.isWide,
        isNoBall: b.isNoBall,
      }));

      // Append the ball just played (not yet in cache)
      const allBalls = [
        ...overBalls,
        { runs, isWicket, isWide: extras.isWide, isNoBall: extras.isNB },
      ];

      // 1. Batter milestone
      const currentBatter = innings.InningBatting.find(
        (b) => b.playerId === innings.currentStrikerId
      );
      if (currentBatter && !extras.isWide && !extras.isNB) {
        const prev = currentBatter.runs;
        const next = prev + (!extras.isBye && !extras.isLegBye ? runs : 0);
        const milestone = detectBatterMilestone(
          batterName ?? "Batter",
          prev,
          next,
          overContext,
          teamScore
        );
        if (milestone && !hasSeenKey(milestone.dedupeKey)) {
          markKey(milestone.dedupeKey);

          return; // one event per ball
        }
      }

      // 2. Hat-trick
      if (isWicket) {
        const hat = detectHatTrick(allBalls, bowlerName ?? "Bowler", overContext, teamScore);
        if (hat && !hasSeenKey(hat.dedupeKey)) {
          markKey(hat.dedupeKey);

          return;
        }
      }

      // 3. Special boundary events
      if (!isWicket) {
        const special = detectSpecialBoundaryEvents(
          allBalls,
          batterName ?? "Batter",
          bowlerName ?? "Bowler",
          overContext,
          teamScore
        );
        if (special && !hasSeenKey(special.dedupeKey)) {
          markKey(special.dedupeKey);
          return;
        }
      }

      // 4. Maiden over — checked when over ends
      if ((innings.balls + 1) % 6 === 0 && !extras.isWide && !extras.isNB) {
        const maiden = detectMaidenOver(allBalls, bowlerName ?? "Bowler", overContext, teamScore);
        if (maiden && !hasSeenKey(maiden.dedupeKey)) {
          markKey(maiden.dedupeKey);
        }
      }
    },
    [
      isEnabled,
      innings,
      extras,
      batterName,
      bowlerName,
      overContext,
      teamScore,
      hasSeenKey,
      markKey,
      queryClient,
    ]
  );

  // ── Ball submission — asks for shot direction if commentary enabled ────────
  const submitBall = useCallback(
    (runs: number, shotSide: ShotSide | null, wicket: FallWicket | null) => {
      if (!wicket) {
        execute({
          matchId: innings.matchId,
          inningId: innings.id,
          runs,
          batsmanId: innings.currentStrikerId as string,
          isBye: extras.isBye ? true : extras.isWide && runs > 0 ? true : false,
          isWide: extras.isWide,
          isLegBye: extras.isLegBye,
          isNoBall: extras.isNB,
          isWicket: false,
          isLastWicket: false,
          shotSide,
        });

        // Check for auto events (slightly async — doesn't block UI)

        checkAutoEvents(runs, false);
      } else if (wicket.type === "RUN_OUT") {
        execute({
          matchId: innings.matchId,
          inningId: innings.id,
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
          isLastWicket: match.playerLimit === innings.wickets + 2,
          outBatsmanId:
            wicket.batsmanId.trim() !== ""
              ? wicket.batsmanId
              : (innings.currentStrikerId as string),
          shotSide,
        });

        checkAutoEvents(runs, true);
      } else {
        execute({
          matchId: innings.matchId,
          inningId: innings.id,
          runs: 0,
          isWicket: true,
          dismissalType: wicket.type,
          fielderId: wicket.fielderId,
          batsmanId: innings.currentStrikerId as string,
          outBatsmanId: innings.currentStrikerId as string,
          nextBatsmanId: wicket.nextBatsmanId as string,
          isLastWicket: match.playerLimit === innings.wickets + 2,
          isBye: extras.isBye,
          isLegBye: extras.isLegBye,
          isNoBall: extras.isNB,
          isWide: extras.isWide,
          shotSide,
        });

        checkAutoEvents(0, true);
      }

      resetExtras();
    },
    [
      execute,
      innings,
      match,
      extras,
      batterName,
      bowlerName,
      overContext,
      teamScore,
      checkAutoEvents,
    ]
  );

  const resetExtras = () =>
    setExtras({ isWide: false, isNB: false, isLegBye: false, isBye: false });

  const playerLeftToBat = useMemo(() => {
    return battingPlayers.filter(
      (batsman) =>
        batsman.playerId !== innings.currentNonStrikerId &&
        batsman.playerId !== innings.currentStrikerId &&
        !batsman.isOut
    );
  }, [innings]);

  const channelName = `match:${match.id}`;

  useChannel(channelName, "ball-added", async (msg) => {
    await queryClient.refetchQueries({
      queryKey: ["match", match.id],
    });

    await queryClient.refetchQueries({
      queryKey: ["match-innings", match.id],
    });

    const lastInningId = innings.id;

    const { data } = msg;

    if (data.isCompleted) {
      setIsOverFinished(false);
    }

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

  useChannel(channelName, "inning-completed", async (msg) => {
    setIsOverFinished(false);
    await queryClient.refetchQueries({
      queryKey: ["match", match.id],
    });
  });

  return (
    <aside className="space-y-6 lg:col-span-4">
      <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-sm font-black tracking-widest uppercase italic">Scoring Pad</h3>
          <button
            onClick={handleUndo}
            className="rounded-2xl bg-slate-100 p-3 text-slate-400 transition-all hover:text-emerald-500 active:scale-90 dark:bg-white/5"
            title="Undo Last Ball"
          >
            <Undo2 className="h-5 w-5" />
          </button>
        </div>

        {/* Runs Grid */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 6].map((num) => (
            <button
              key={num}
              onClick={() => onBallPress(num)}
              className="flex aspect-square items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-2xl font-black shadow-sm transition-all hover:scale-105 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white active:scale-95 dark:border-white/5 dark:bg-white/5"
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
              disabled={isSubmitting}
              label="NB"
              active={extras.isNB}
              sub="No Ball"
              onClick={() => handleExtras("nb")}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-4 text-[10px] font-black tracking-widest text-emerald-600 uppercase shadow-sm transition-all hover:bg-emerald-600 hover:text-white dark:text-emerald-100"
            />

            <PadButton
              disabled={isSubmitting}
              label="B"
              active={extras.isBye}
              sub="Bye"
              onClick={() => handleExtras("b")}
              className="rounded-2xl border border-slate-200 bg-slate-100 py-4 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm transition-all hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            />
            <PadButton
              disabled={isSubmitting}
              label="LB"
              active={extras.isLegBye}
              sub="Leg bye"
              onClick={() => handleExtras("lb")}
              className="rounded-2xl border border-slate-200 bg-slate-100 py-4 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm transition-all hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            />

            <PadButton
              disabled={isSubmitting}
              label="W"
              active={isWicket}
              className={`${
                isWicket ? "scale-75 text-white ring-rose-500" : ""
              } group col-span-2 flex w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-rose-500 bg-rose-600 py-6 text-white shadow-xl shadow-rose-600/30 transition-all hover:bg-rose-700 active:scale-95 dark:bg-red-800`}
              sub="Wicket"
              onClick={() => setIsWicket(true)}
            />
          </div>
        </div>
      </div>

      {/* Ball Timeline (Vertical/Mini version for sidebar) */}
      <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900 p-8 text-white shadow-xl">
        <div className="mb-6 flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-500" />
          <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase">
            Timeline
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {history &&
            history.slice(0, 12).map((ball, i) => (
              <div
                key={i}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-[10px] font-black transition-all ${
                  ball.isWicket
                    ? "border-rose-600 bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                    : ball.runs === 4 || ball.runs === 6
                      ? "border-emerald-600 bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                      : "border-white/20 bg-white/10 text-slate-300"
                }`}
              >
                {ball.isWicket ? "W" : isLegalBall(ball) ? "Ex" : ball.runs}
              </div>
            ))}
        </div>
      </div>
      <WicketDetailsModal
        isSubmitting={isSubmitting}
        fielders={bowlingPlayers}
        batsmanOnCrease={battingPlayers.filter(
          (batsman) =>
            batsman.playerId === innings.currentNonStrikerId ||
            batsman.playerId === innings.currentStrikerId
        )}
        playersLeftToBat={playerLeftToBat}
        isOpen={isWicket}
        onClose={() => setIsWicket(false)}
        onConfirm={onBall}
      />
      <SelectBowlerModal
        isSaving={isChanging}
        bowlers={bowlingPlayers.filter(
          (bowler) => bowler.playerId !== innings.currentBowlerId || bowler.overs > match.overLimit
        )}
        isOpen={isOverFinished && match.status !== "inning_completed"}
        onSubmit={handleChangeBowler}
      />
      <ShotDirectionModal
        isOpen={!!pendingBall}
        runs={pendingBall?.runs ?? 0}
        batterName={batterName}
        onSelect={(side) => {
          if (!pendingBall) return;
          submitBall(pendingBall.runs, side, pendingBall.wicket);
          setPendingBall(null);
        }}
        onSkip={() => {
          if (!pendingBall) return;
          const { runs, wicket } = pendingBall;
          setPendingBall(null);
          submitBall(runs, null, wicket);
        }}
      />
    </aside>
  );
};

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
  onClick: any;
  disabled: boolean;
  active?: boolean;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      `relative flex flex-col items-center justify-center rounded-2xl p-4 text-2xl font-black transition-all ease-in-out`,
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
