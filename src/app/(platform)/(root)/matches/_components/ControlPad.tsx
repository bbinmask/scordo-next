import { cn } from "@/lib/utils";
import { Undo2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import WicketDetailsModal from "./modals/WicketDetailsModal";
import { InningDetails, MatchWithDetails } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { changeBowler, pushBall, undoBall } from "@/actions/match-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WicketType } from "@/generated/prisma";
import axios from "axios";
import { SelectBowlerModal } from "./modals/SelectBowlerModal";
import { useChannel } from "ably/react";
import { ShotDirectionModal } from "./modals/ShotDirectionModal";
import { ShotSide, ShotType } from "@/lib/commentary/types";
import { FallWicket } from "@/types/match.props";
type ExtraType = "wd" | "nb" | "b" | "lb";

interface ControlPadProps {
  innings: InningDetails;
  match: MatchWithDetails;
}

export const ControlPad = ({ innings, match }: ControlPadProps) => {
  const queryClient = useQueryClient();

  const { execute, isLoading: isSubmitting } = useAction(pushBall, {
    onSuccess() {},
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeChangeBowler, isLoading: isChanging } = useAction(changeBowler, {
    onSuccess() {
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

  const [pendingBall, setPendingBall] = useState<{
    runs: number;
    wicket: null | {
      fielderId: string;
      batsmanId: string;
      nextBatsmanId: string | null;
      type: WicketType;
    };
  } | null>(null);

  const [extras, setExtras] = useState({
    isWide: false,
    isBye: false,
    isLegBye: false,
    isNB: false,
  });
  const [isOverFinished, setIsOverFinished] = useState(false);
  const [isWicket, setIsWicket] = useState(false);

  const batterName = useMemo(
    () =>
      innings.InningBatting.find((b) => b.playerId === innings.currentStrikerId)?.player.user.name,
    [innings]
  );

  const battingPlayers = useMemo(() => {
    return innings.InningBatting;
  }, [innings]);

  const bowlingPlayers = useMemo(() => {
    return innings.InningBowling;
  }, [innings]);

  const playerLeftToBat = useMemo(() => {
    return battingPlayers.filter(
      (batsman) =>
        batsman.playerId !== innings.currentNonStrikerId &&
        batsman.playerId !== innings.currentStrikerId &&
        !batsman.isOut
    );
  }, [battingPlayers, innings.currentNonStrikerId, innings.currentStrikerId]);

  const isLoading = isSubmitting || isUndoing;

  const handleUndo = () => {};

  const onBallPress = (runs: number) => {
    if (match?.commentaryEnabled) {
      setPendingBall({ runs, wicket: null });
    } else {
      submitBall(runs, null, null, null);
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

  const handleChangeBowler = (bowlerId: string) => {
    executeChangeBowler({
      matchId: innings.matchId,
      inningId: innings.id,
      bowlerId,
    });
  };

  const resetExtras = () => {
    setExtras({ isWide: false, isNB: false, isLegBye: false, isBye: false });
  };

  const handleSelect = (side: ShotSide, type: ShotType) => {
    if (!pendingBall) return;
    submitBall(pendingBall.runs, side, type, pendingBall.wicket);
    setPendingBall(null);
  };

  const handleSkip = () => {
    if (!pendingBall) return;
    const { runs, wicket } = pendingBall;
    setPendingBall(null);
    submitBall(runs, null, null, wicket);
  };

  const onBall = (
    runs: number,
    wicket: {
      fielderId: string;
      batsmanId: string;
      nextBatsmanId: string | null;
      type: WicketType;
    } | null
  ) => {
    if (match?.commentaryEnabled) {
      setPendingBall({ runs, wicket });
    } else {
      submitBall(runs, null, null, wicket);
    }
  };

  const submitBall = useCallback(
    (
      runs: number,
      shotSide: ShotSide | null,
      shotType: ShotType | null,
      wicket: FallWicket | null
    ) => {
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
      }

      resetExtras();
    },
    [execute, innings, match, extras]
  );

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

  useChannel(channelName, "inning-completed", async () => {
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
              disabled={isLoading}
              onClick={() => handleExtras("wd")}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-4 text-[10px] font-black tracking-widest text-emerald-600 uppercase shadow-sm transition-all hover:bg-emerald-600 hover:text-white dark:text-emerald-100"
            />

            <PadButton
              disabled={isLoading}
              label="NB"
              active={extras.isNB}
              sub="No Ball"
              onClick={() => handleExtras("nb")}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-4 text-[10px] font-black tracking-widest text-emerald-600 uppercase shadow-sm transition-all hover:bg-emerald-600 hover:text-white dark:text-emerald-100"
            />

            <PadButton
              disabled={isLoading}
              label="B"
              active={extras.isBye}
              sub="Bye"
              onClick={() => handleExtras("b")}
              className="rounded-2xl border border-slate-200 bg-slate-100 py-4 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm transition-all hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            />
            <PadButton
              disabled={isLoading}
              label="LB"
              active={extras.isLegBye}
              sub="Leg bye"
              onClick={() => handleExtras("lb")}
              className="rounded-2xl border border-slate-200 bg-slate-100 py-4 text-[10px] font-black tracking-widest text-slate-500 uppercase shadow-sm transition-all hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            />

            <PadButton
              disabled={isLoading}
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

      <WicketDetailsModal
        isSubmitting={isLoading}
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
        onSelect={(side, type) => handleSelect(side, type)}
        onSkip={handleSkip}
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
  onClick: () => void;
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
