"use client";
// src/app/(platform)/(root)/matches/quick-match/_components/QuickHeroSection.tsx
//
// Hero banner for the Quick Match scoring page.
// Mirrors MatchHeroSection but consumes QuickMatch data — no Prisma types needed.

import { Shield, Zap } from "lucide-react";
import type { QuickMatch } from "@/types/quick-match";

interface QuickHeroSectionProps {
  match: QuickMatch;
}

export function QuickHeroSection({ match }: QuickHeroSectionProps) {
  const { teamA, teamB, innings } = match;

  // Run summary string per team from completed / current innings
  const getTeamScore = (teamId: string) => {
    const inn = innings.find((i) => i.battingTeamId === teamId);
    if (!inn) return null;
    return `${inn.runs}/${inn.wickets} (${inn.overs}.${inn.balls % 6})`;
  };

  const scoreA = getTeamScore(teamA.id);
  const scoreB = getTeamScore(teamB.id);

  return (
    <div className="relative h-52 w-full overflow-hidden md:h-72">
      {/* Split banner */}
      <div className="absolute inset-0 flex">
        {/* Team A side */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 opacity-90">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/10 bg-white/5 shadow-xl">
            <Shield className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-[poppins] text-xs font-black uppercase tracking-widest text-white">
            {teamA.abbreviation}
          </p>
          {scoreA && (
            <p className="font-[poppins] text-sm font-black text-emerald-400">{scoreA}</p>
          )}
        </div>

        {/* Centre VS badge */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="flex h-14 w-14 -translate-x-1/2 translate-x-0 items-center justify-center rounded-full bg-emerald-600 font-black text-white italic shadow-2xl shadow-emerald-600/40 md:h-16 md:w-16">
            VS
          </div>
        </div>

        {/* Team B side */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-bl from-slate-800 via-slate-900 to-slate-950 opacity-90">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/10 bg-white/5 shadow-xl">
            <Shield className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-[poppins] text-xs font-black uppercase tracking-widest text-white">
            {teamB.abbreviation}
          </p>
          {scoreB && (
            <p className="font-[poppins] text-sm font-black text-emerald-400">{scoreB}</p>
          )}
        </div>
      </div>

      {/* Quick match badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="status-badge status-badge--green inline-flex items-center gap-1.5">
          <Zap className="h-3 w-3" />
          Quick Match • Guest Mode
        </span>
      </div>
    </div>
  );
}
