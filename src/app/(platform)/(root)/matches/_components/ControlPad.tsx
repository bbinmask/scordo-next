import { cn } from "@/lib/utils";
import { RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import WicketDetailsModal from "./modals/WicketDetailsModal";
import { PlayerWithUser } from "@/lib/types";

type ExtraType = "wd" | "nb" | "b";

interface ControlPadProps {
  battingPlayers: PlayerWithUser[];
  bowlingPlayers: PlayerWithUser[];
}

export const ControlPad = ({ battingPlayers, bowlingPlayers }: ControlPadProps) => {
  const onBall = (runs: number, extra?: ExtraType | null, wicket?: boolean) => {
    setExtras({
      isWide: false,
      isNB: false,
      isBye: false,
    });
  };
  const [extras, setExtras] = useState({
    isWide: false,
    isBye: false,
    isNB: false,
  });
  const [isWicket, setIsWicket] = useState(false);
  const [isRunOut, setIsRunOut] = useState(false);

  const onUndo = () => {};

  const Btn = ({
    label,
    sub,
    onClick,
    active,
    className,
  }: {
    label: string;
    sub?: string;
    onClick: any;
    active?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        `relative flex aspect-square flex-col items-center justify-center rounded-2xl p-4 text-2xl font-black transition-all ease-in-out`,
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

  const handleExtras = (type: ExtraType) => {
    switch (type) {
      case "b":
        setExtras((prev) => ({
          isBye: !prev.isBye,
          isWide: prev.isNB ? false : prev.isWide,
          isNB: prev.isWide ? false : prev.isNB,
        }));

        break;
      case "wd":
        setExtras((prev) => ({
          isBye: prev.isBye,
          isWide: !prev.isWide,
          isNB: false,
        }));

        break;
      case "nb":
        setExtras((prev) => ({
          isBye: prev.isBye,
          isWide: false,
          isNB: !prev.isNB,
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
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-5 gap-3">
        <Btn
          label="0"
          onClick={() => onBall(0)}
          className={`${nullClasses} active:translate-y-1 active:scale-90`}
        />
        <Btn label="1" onClick={() => onBall(1)} className={`${runsClasses}`} />
        <Btn label="2" onClick={() => onBall(2)} className={`${runsClasses}`} />
        <Btn
          label="WD"
          sub="Wide"
          active={extras.isWide}
          className={`${nullClasses} border-input border ring-2`}
          onClick={() => handleExtras("wd")}
        />
        <Btn
          label="B"
          active={extras.isBye}
          className={`${nullClasses} ring-2`}
          sub="Bye"
          onClick={() => handleExtras("b")}
        />
        <Btn label="3" onClick={() => onBall(3)} className={`${runsClasses}`} />
        <Btn label="4" onClick={() => onBall(4)} className={`${boundaryClasses}`} />
        <Btn label="6" className={`${boundaryClasses}`} onClick={() => onBall(6)} />
        <Btn
          label="NB"
          active={extras.isNB}
          className={`${nullClasses} ring-2`}
          sub="No Ball"
          onClick={() => handleExtras("nb")}
        />
        <Btn
          label="W"
          active={isWicket}
          className={`${
            isWicket ? "scale-75 text-white ring-red-500" : ""
          } bg-red-600 text-slate-100 shadow-sm dark:bg-red-800`}
          sub="Wicket"
          onClick={() => setIsWicket((prev) => !prev)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3"></div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onUndo}
          disabled={history.length === 0}
          className={cn(
            "center flex flex-[2] gap-3 rounded-2xl bg-yellow-800 py-4 font-[inter] text-xs font-semibold text-slate-100 transition-all",
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
      <WicketDetailsModal
        fielders={bowlingPlayers}
        batters={[battingPlayers[0], battingPlayers[1]]}
        isOpen={isWicket}
        onClose={() => setIsWicket(false)}
        onConfirm={() => {}}
      />
    </div>
  );
};
