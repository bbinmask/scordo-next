"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Sparkles } from "lucide-react";

interface CommentaryEnableModalProps {
  isOpen: boolean;
  onEnable: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export function CommentaryEnableModal({
  isOpen,
  onEnable,
  onClose,
  onSkip,
}: CommentaryEnableModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm rounded-3xl border-0 p-0 shadow-2xl dark:bg-slate-900"
        // Prevent closing on overlay click — user must make a choice
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-6 pt-8 pb-8 text-center text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 shadow-xl backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-[poppins] text-xl font-black tracking-tight text-white uppercase">
                AI Commentary
              </DialogTitle>
            </DialogHeader>
            <p className="mt-2 font-[urbanist] text-sm font-semibold text-green-100">
              Powered by AI · Real-time · Hinglish
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="font-[urbanist] text-sm leading-relaxed font-semibold text-slate-600 dark:text-slate-300">
            Want{" "}
            <span className="font-black text-emerald-600 dark:text-emerald-400">
              live AI commentary
            </span>{" "}
            for this match?
          </p>
          <p className="mt-2 font-[urbanist] text-xs font-semibold text-slate-400">
            Our AI commentator will narrate every boundary, wicket, milestone, and big moment — in
            English with a touch of Hinglish drama! 🏏
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "Ball-by-ball commentary",
              "Wicket & milestone announcements",
              "Hat-tricks, sixes streaks & more",
              "Mixed English + Hindi phrases",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 font-[urbanist] text-xs font-semibold text-slate-500 dark:text-slate-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={onEnable}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 font-[urbanist] text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 active:scale-95"
            >
              <Mic className="h-4 w-4" />
              Yes, enable AI commentary
            </button>
            <button
              onClick={onSkip}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 font-[urbanist] text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              <MicOff className="h-4 w-4" />
              No thanks
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
