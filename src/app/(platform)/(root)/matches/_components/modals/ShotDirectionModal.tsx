"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShotSide } from "@/lib/commentary/engine";
import { cn } from "@/lib/utils";

interface ShotDirectionModalProps {
  isOpen: boolean;
  runs: number;
  batterName?: string;
  onSelect: (side: ShotSide) => void;
  onSkip: () => void;
}

const SHOT_OPTIONS: { value: ShotSide; label: string; emoji: string; desc: string }[] = [
  { value: "covers", label: "Covers", emoji: "↗️", desc: "Classic cover drives" },
  { value: "point", label: "Point", emoji: "➡️", desc: "Cut shots square of wicket" },
  { value: "third-man", label: "Third Man", emoji: "↘️", desc: "Edges, late cuts" },
  { value: "fine-leg", label: "Fine Leg", emoji: "↙️", desc: "Glances, fine sweeps" },
  { value: "square-leg", label: "Square Leg", emoji: "⬅️", desc: "Pulls and sweeps" },
  { value: "mid-wicket", label: "Mid Wicket", emoji: "↖️", desc: "Flicks, powerful leg shots" },
  { value: "mid-on", label: "Mid On", emoji: "⬆️", desc: "Straight drives on leg side" },
  { value: "mid-off", label: "Mid Off", emoji: "⬆️", desc: "Straight drives on off side" },
  { value: "long-on", label: "Long On", emoji: "🔼", desc: "Lofted shots over mid-on" },
  { value: "long-off", label: "Long Off", emoji: "🔼", desc: "Lofted shots over mid-off" },
];

export function ShotDirectionModal({
  isOpen,
  runs,
  batterName,
  onSelect,
  onSkip,
}: ShotDirectionModalProps) {
  const runLabel =
    runs === 0
      ? "dot ball"
      : runs === 4
        ? "FOUR! 🏏"
        : runs === 6
          ? "SIX! 💥"
          : `${runs} run${runs !== 1 ? "s" : ""}`;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onSkip()}>
      <DialogContent className="max-w-sm overflow-hidden rounded-3xl border-0 p-0 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="font-[poppins] text-lg font-black tracking-tight text-white uppercase">
              {runLabel}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-1 font-[urbanist] text-sm font-semibold text-green-100">
            {batterName ? `${batterName} — ` : ""}Which direction was the shot played?
          </p>
        </div>

        {/* Shot grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {SHOT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-xs font-bold transition-colors hover:bg-emerald-500 hover:text-white dark:border-white/5 dark:bg-white/5"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Skip */}
        <div className="border-t border-slate-100 px-5 pt-3 pb-5 dark:border-white/10">
          <button
            onClick={onSkip}
            className="w-full rounded-2xl py-2.5 font-[urbanist] text-xs font-bold text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
          >
            Skip commentary for this ball
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
