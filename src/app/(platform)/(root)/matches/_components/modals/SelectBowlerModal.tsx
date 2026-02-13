import { InningBowlingDetails } from "@/lib/types";
import { ChevronRight, Flame, Info, UserIcon } from "lucide-react";
import { useState } from "react";

export const SelectBowlerModal = ({
  isOpen,
  onSubmit,
  bowlers,
}: {
  isOpen: boolean;
  onSubmit: (bowlerId: string) => void;
  bowlers: InningBowlingDetails[];
}) => {
  const [selectedBowlerId, setSelectedBowlerId] = useState("");
  const [error, setError] = useState("");

  const onSelect = (bowlerId: string) => {
    setError(selectedBowlerId === bowlerId ? "Select a bowler" : "");
    setSelectedBowlerId((prev) => (prev === bowlerId ? "" : bowlerId));
  };

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
                For the next over
              </p>
            </div>
          </div>
        </div>

        {/* Bowler List */}
        <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto p-8 pt-4 font-[inter]">
          <p className="mb-2 px-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Available Bowlers
          </p>
          <div className="space-y-2">
            {bowlers.map((bowler, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(bowler.playerId)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                  selectedBowlerId === bowler.playerId
                    ? "border-teal-500 bg-teal-500/10 text-teal-600"
                    : "border-slate-100 bg-slate-50 text-slate-400 dark:border-white/5 dark:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900 uppercase dark:text-white">
                      {bowler.player.user.name}{" "}
                      <span className="ml-2 font-[poppins] text-xs font-normal text-slate-600 lowercase dark:text-slate-200">
                        ({bowler.player.user.username})
                      </span>
                    </h4>
                  </div>
                </div>
                <p className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase italic">
                  {bowler.overs} Overs Bowled
                </p>
              </button>
            ))}
            {error.trim() !== "" && <p className="text-xs text-red-500">Select a bowler</p>}
          </div>
        </div>

        <button
          className="primary-btn mx-auto rounded-xl px-12 py-2"
          onClick={() => {
            if (selectedBowlerId.trim() === "") setError("Select a bowler");
            else onSubmit(selectedBowlerId);
          }}
        >
          Save
        </button>
        {/* Rules Footer */}
        <div className="mt-4 flex items-start gap-3 border-t border-slate-100 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
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
