"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BallType, ShotSide, ShotType } from "@/lib/commentary/types";
import { formatRuns } from "@/utils/helper/scorecard";
import { useState } from "react";

interface ShotDirectionModalProps {
  isOpen: boolean;
  runs: number;
  batterName?: string;
  onSelect: (side: ShotSide, shotType: ShotType) => void;
  onSkip: () => void;
}

const SHOT_SIDE: { value: ShotSide; label: string; emoji: string; desc: string }[] = [
  { value: "straight", label: "Straight", emoji: "↗️", desc: "Straight shots" },
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

const SHOT_TYPE: { value: ShotType; label: string; emoji: string; desc: string }[] = [
  { value: "CUT", label: "Cut", emoji: "↗️", desc: "Classic cover drives" },
  { value: "DRIVE", label: "Drive", emoji: "➡️", desc: "Straight drives" },
  { value: "PULL", label: "Pull", emoji: "↘️", desc: "Pull shots off the back foot" },
  { value: "FLICK", label: "Flick", emoji: "↙️", desc: "Wristy flicks" },
  { value: "DEFENSE", label: "Defense", emoji: "⬅️", desc: "Solid defensive shots" },
  { value: "LOFTED", label: "Lofted", emoji: "↖️", desc: "Lofted shots over the wicket" },
  { value: "GLANCE", label: "Glance", emoji: "⬆️", desc: "Glances off the back foot" },
  { value: "UPPER_CUT", label: "Upper Cut", emoji: "⬆️", desc: "Upper cut shots" },
  {
    value: "REVERSE_SWEEP",
    label: "Reverse Sweep",
    emoji: "🔼",
    desc: "Innovative cricket on display",
  },
  { value: "SWEEP", label: "Sweep", emoji: "🔼", desc: "Sweep shots off the back foot" },
  { value: "HOOK", label: "Hook", emoji: "🔼", desc: "Hook shots off the back foot" },
  { value: "LEAVE", label: "Leave", emoji: "🔼", desc: "Left the ball" },
];

const BALL_TYPE: { value: BallType; label: string; desc: string }[] = [
  { value: "BOUNCER", label: "Bouncer", desc: "Short-pitched deliveries" },
  { value: "FULL", label: "Full", desc: "Full deliveries" },
  { value: "GOOD_LENGTH", label: "Good Length", desc: "Good length deliveries" },
  { value: "SHORT", label: "Short", desc: "Short deliveries" },
  { value: "SLOWER", label: "Slower", desc: "Slower deliveries" },
  { value: "LEG_SPIN", label: "Leg Spin", desc: "Leg spin bowling deliveries" },
  { value: "YORKER", label: "Yorker", desc: "Full-length deliveries" },
  { value: "GOOGLY", label: "Googly", desc: "Goo gly deliveries" },
  { value: "FLIPPER", label: "Flipper", desc: "Flipper deliveries" },
  { value: "INSWING", label: "Inswing", desc: "Inswing deliveries" },
  { value: "OUTSWING", label: "Outswing", desc: "Outswing deliveries" },
  { value: "REVERSE_SWING", label: "Reverse Swing", desc: "Reverse swing deliveries" },
  { value: "OFF_SPIN", label: "Off Spin", desc: "Off spin bowling deliveries" },
];

export function ShotDirectionModal({
  isOpen,
  runs,
  batterName,
  onSelect,
  onSkip,
}: ShotDirectionModalProps) {
  const runLabel = formatRuns(runs);

  const [shotSide, setShotSide] = useState<ShotSide | null>(null);
  const [shotType, setShotType] = useState<ShotType | null>(null);

  const handleSelect = () => {
    if (!shotType || !shotSide) {
      alert("Please select both shot type and direction.");
      return;
    }

    onSelect(shotSide, shotType);
    setShotSide(null);
    setShotType(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onSkip()}>
      <DialogContent className="p-0">
        {/* Header */}
        <div className="relative">
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
          <div className="mb-6 grid grid-cols-2 gap-3 px-4 pt-2">
            {SHOT_SIDE.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setShotSide(opt.value)}
                className={`cursor-pointer rounded-xl border border-slate-200 px-2 py-3 font-[urbanist] text-xs font-bold transition-colors hover:bg-emerald-500 hover:text-white dark:border-white/5 dark:bg-white/5 ${shotSide === opt.value ? "bg-emerald-500 text-white" : "bg-slate-50"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 px-4">
            {SHOT_TYPE.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setShotType(opt.value)}
                className={`cursor-pointer rounded-xl border border-slate-200 px-2 py-3 font-[urbanist] text-xs font-bold transition-colors hover:bg-emerald-500 hover:text-white dark:border-white/5 dark:bg-white/5 ${shotType === opt.value ? "bg-emerald-500 text-white" : "bg-slate-50"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Skip */}
          <div className="sticky bottom-2 flex w-full gap-2 px-5 pt-3 pb-5">
            <button
              disabled={!shotSide || !shotType}
              onClick={handleSelect}
              className={`w-full rounded-xl px-2 py-3 font-[urbanist] text-xs font-bold text-white transition-all ${shotSide && shotType ? "bg-emerald-500 hover:bg-emerald-600" : "cursor-not-allowed bg-emerald-300"}`}
            >
              Done
            </button>
            <button
              onClick={onSkip}
              className="w-full rounded-xl border px-2 py-3 font-[urbanist] text-xs font-bold text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
            >
              Skip commentary for this ball
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
