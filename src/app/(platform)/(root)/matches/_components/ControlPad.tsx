import { cn } from "@/lib/utils";
import { RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import WicketDetailsModal from "./modals/WicketDetailsModal";

type ExtraType = "wd" | "nb" | "b";

interface ControlPadProps {}

export const ControlPad = ({}: ControlPadProps) => {
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
  const [isWicket, setIsWicket] = useState(true);
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
        `relative flex aspect-square flex-col items-center justify-center rounded-2xl p-4 text-2xl font-black transition-all ease-in-out active:translate-y-1 active:scale-90`,
        active ? "translate-y-[2px] scale-95 border-b-0 ring-4" : "",
        className
      )}
    >
      <span className="text-xl font-bold italic">{label}</span>
      {sub && <span className="text-[10px] font-semibold tracking-wide opacity-70">{sub}</span>}
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

  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-5 gap-3">
        <Btn
          label="0"
          onClick={() => onBall(0)}
          className="bg-slate-50 text-slate-600 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
        />
        <Btn
          label="1"
          onClick={() => onBall(1)}
          className="border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400"
        />
        <Btn
          label="2"
          onClick={() => onBall(2)}
          className="border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400"
        />
        <Btn
          label="WD"
          sub="Wide"
          active={extras.isWide}
          className={`bg-slate-50 text-slate-600 shadow-sm ring-indigo-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300`}
          onClick={() => handleExtras("wd")}
        />
        <Btn
          label="B"
          active={extras.isBye}
          className={`bg-slate-50 text-slate-600 shadow-sm ring-indigo-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300`}
          sub="Bye"
          onClick={() => handleExtras("b")}
        />
        <Btn
          label="3"
          onClick={() => onBall(3)}
          className="border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400"
        />
        <Btn
          label="4"
          onClick={() => onBall(4)}
          className="border-emerald-600 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
        />
        <Btn
          label="6"
          className="border-emerald-600 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
          onClick={() => onBall(6)}
        />
        <Btn
          label="NB"
          active={extras.isNB}
          className={`bg-slate-50 text-slate-600 shadow-sm ring-indigo-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300`}
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
            "flex flex-[2] items-center justify-center gap-3 rounded-2xl border-b-4 py-4 text-xs font-black tracking-widest uppercase transition-all",
            history.length > 0
              ? "border-slate-200 bg-slate-100 text-slate-600 active:translate-y-1 active:border-b-0"
              : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 opacity-50"
          )}
        >
          <RotateCcw size={16} />
          Undo Ball
        </button>
        <button
          onClick={() => toast.error("Settings coming soon!")}
          className="flex flex-1 items-center justify-center rounded-2xl border-b-4 border-slate-200 bg-slate-100 p-4 text-slate-400 active:translate-y-1 active:border-b-0"
        >
          <Settings size={20} />
        </button>
      </div>
      <WicketDetailsModal
        isOpen={isWicket}
        onClose={() => setIsWicket(false)}
        onConfirm={() => {}}
        pendingRuns={20}
      />
    </div>
  );
};
