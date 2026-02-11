import { cn } from "@/lib/utils";
import { RotateCcw, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import WicketDetailsModal from "./modals/WicketDetailsModal";
import { InningDetails, MatchWithDetails, PlayerWithUser } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { pushBall } from "@/actions/match-actions";
import { useQueryClient } from "@tanstack/react-query";
import { WicketType } from "@/generated/prisma";
type ExtraType = "wd" | "nb" | "b";

interface ControlPadProps {
  innings: InningDetails;
}

export const ControlPad = ({ innings }: ControlPadProps) => {
  const queryClient = useQueryClient();

  const { execute, isLoading: isSubmitting } = useAction(pushBall, {
    onSuccess(data) {
      console.log({ data });
      queryClient.invalidateQueries({ queryKey: ["match-innings", innings.matchId] });
    },
    onError(error) {
      console.log(error);
    },
  });

  const onBall = (
    runs: number,
    wicket?: { fielderId: string; batsmanId: string; nextBatsmanId: string; type: WicketType }
  ) => {
    if (wicket === undefined) {
      execute({
        matchId: innings.matchId,
        inningId: innings.id,
        runs: runs,
        batsmanId: innings.currentStrikerId as string,
        isBye: extras.isBye,
        isLegBye: extras.isLegBye,
        isNoBall: extras.isNB,
        isWicket: false,
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
      });
    } else {
      execute({
        matchId: innings.matchId,
        inningId: innings.id,
        runs: 0,
        isWicket: true,
        dismissalType: wicket.type,
        fielderId: wicket.fielderId,
        batsmanId: wicket.batsmanId,
        isBye: extras.isBye,
        isLegBye: extras.isLegBye,
        isNoBall: extras.isNB,
        isWide: extras.isWide,
      });
    }
    setExtras({
      isWide: false,
      isNB: false,
      isLegBye: false,
      isBye: false,
    });
  };
  const [extras, setExtras] = useState({
    isWide: false,
    isBye: false,
    isLegBye: false,
    isNB: false,
  });
  const [isWicket, setIsWicket] = useState(false);
  const [isRunOut, setIsRunOut] = useState(false);

  const battingPlayers = useMemo(() => {
    return innings.InningBatting;
  }, [innings]);
  const bowlingPlayers = useMemo(() => {
    return innings.InningBowling;
  }, [innings]);

  const onUndo = () => {};
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

  const runsClasses =
    "border-indigo-100 border dark:border-none border-input bg-indigo-100 text-indigo-600 shadow-md active:translate-y-1 active:scale-90  dark:bg-indigo-500/10 dark:text-indigo-400";

  const nullClasses =
    "bg-slate-100 border border-input dark:border-none text-slate-600 shadow-sm hover:bg-slate-200  dark:bg-slate-800 dark:text-slate-300";

  const boundaryClasses =
    "border-emerald-600 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 active:translate-y-1 active:scale-90";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-4">
        <h3 className="flex items-center gap-3 font-[poppins] text-2xl font-black uppercase italic lg:text-3xl">
          Control
          <span className="primary-heading pr-2">Pad</span>
        </h3>
        <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
        <span className="font-[urbanist] text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Powered by Scordo
        </span>
      </div>
      <div className="flex w-full flex-col justify-center gap-4 space-y-6 p-8 lg:flex-row">
        <div className="grid w-full max-w-2xl grid-cols-5 gap-3 lg:gap-2">
          <PadButton
            disabled={isSubmitting}
            label="0"
            onClick={() => onBall(0)}
            className={`${nullClasses} active:translate-y-1 active:scale-90`}
          />
          <PadButton
            disabled={isSubmitting}
            label="1"
            onClick={() => onBall(1)}
            className={`${runsClasses}`}
          />
          <PadButton
            disabled={isSubmitting}
            label="2"
            onClick={() => onBall(2)}
            className={`${runsClasses}`}
          />
          <PadButton
            disabled={isSubmitting}
            label="WD"
            sub="Wide"
            active={extras.isWide}
            className={`${nullClasses} border-input border ring-2`}
            onClick={() => handleExtras("wd")}
          />
          <PadButton
            disabled={isSubmitting}
            label="B"
            active={extras.isBye}
            className={`${nullClasses} ring-2`}
            sub="Bye"
            onClick={() => handleExtras("b")}
          />
          <PadButton
            disabled={isSubmitting}
            label="3"
            onClick={() => onBall(3)}
            className={`${runsClasses}`}
          />
          <PadButton
            disabled={isSubmitting}
            label="4"
            onClick={() => onBall(4)}
            className={`${boundaryClasses}`}
          />
          <PadButton
            disabled={isSubmitting}
            label="6"
            className={`${boundaryClasses}`}
            onClick={() => onBall(6)}
          />
          <PadButton
            disabled={isSubmitting}
            label="NB"
            active={extras.isNB}
            className={`${nullClasses} ring-2`}
            sub="No Ball"
            onClick={() => handleExtras("nb")}
          />
          <PadButton
            disabled={isSubmitting}
            label="W"
            active={isWicket}
            className={`${
              isWicket ? "scale-75 text-white ring-red-500" : ""
            } bg-red-600 text-slate-100 shadow-sm dark:bg-red-800`}
            sub="Wicket"
            onClick={() => setIsWicket((prev) => !prev)}
          />
        </div>

        <div className="flex gap-3 lg:flex-col lg:pb-6">
          <button
            onClick={onUndo}
            disabled={history.length === 0}
            className={cn(
              "center flex min-w-40 flex-[2] gap-3 rounded-2xl bg-yellow-800 py-4 font-[inter] text-xs font-semibold text-slate-100 transition-all",
              history.length > 0
                ? "active:translate-y-1 active:border-b-0"
                : "cursor-not-allowed opacity-50"
            )}
          >
            <RotateCcw size={16} />
            Undo Ball
          </button>
          <button
            className={cn(
              "flex flex-[2] items-center justify-center gap-3 rounded-2xl bg-orange-800 py-3 font-[inter] text-sm font-semibold transition-all active:translate-y-1"
            )}
          >
            Retire Player
          </button>
          <button
            onClick={() => toast.error("Settings coming soon!")}
            className="flex flex-1 items-center justify-center rounded-2xl bg-teal-700 p-4 text-slate-100 active:translate-y-1"
          >
            <Settings size={20} />
          </button>
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
        battingPlayers={battingPlayers.filter(
          (batsman) =>
            batsman.playerId !== innings.currentNonStrikerId &&
            batsman.playerId !== innings.currentStrikerId &&
            !batsman.isOut
        )}
        isOpen={isWicket}
        onClose={() => setIsWicket(false)}
        onConfirm={onBall}
      />
    </div>
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
      `relative flex aspect-square max-h-32 max-w-32 flex-col items-center justify-center rounded-2xl p-4 text-2xl font-black transition-all ease-in-out`,
      active ? "ring-indigo-500" : "ring-transparent",
      className
    )}
  >
    <span className="font-[inter] text-lg font-bold">{label}</span>
    {sub && (
      <span className="font-[urbanist] text-[8px] font-semibold tracking-wide uppercase opacity-70">
        {sub}
      </span>
    )}
  </button>
);
