import { InningBowlingDetails } from "@/lib/types";
import { ChevronRight, Flame, Info, UserIcon } from "lucide-react";

const SelectBowlerModal = ({
  isOpen,
  onSelect,
  bowlers,
}: {
  isOpen: boolean;
  onSelect: (name: string) => void;
  bowlers: InningBowlingDetails[];
}) => {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/95 p-4 font-sans backdrop-blur-md duration-300">
      <div className="animate-in zoom-in relative flex w-full max-w-md flex-col overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl duration-300 dark:border-white/10 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500/10 to-transparent p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-600 p-3 shadow-lg shadow-green-500/30">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                Select Bowler
              </h2>
              <p className="text-[10px] font-black tracking-[0.2em] text-green-500 uppercase">
                New Over Deployment
              </p>
            </div>
          </div>
        </div>

        {/* Bowler List */}
        <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto p-8 pt-4 font-sans">
          <p className="mb-2 px-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Available Roster
          </p>
          <div className="space-y-2">
            {bowlers.map((bowler, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(bowler.player.user.name)}
                className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-green-500/50 dark:border-white/5 dark:bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-colors group-hover:text-green-500 dark:border-white/10 dark:bg-slate-800">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black tracking-tight text-slate-900 uppercase dark:text-white">
                      {bowler.player.user.name}
                    </h4>
                    <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase italic">
                      {bowler.overs} Overs Bowled
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-all group-hover:text-green-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Rules Footer */}
        <div className="flex items-start gap-3 border-t border-slate-100 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
          <p className="text-[9px] leading-relaxed font-medium tracking-wider text-slate-400 uppercase">
            Standard Match Protocol: A bowler cannot bowl two consecutive overs. Deployment of a new
            operative is required to resume the match engine.
          </p>
        </div>
      </div>
    </div>
  );
};
