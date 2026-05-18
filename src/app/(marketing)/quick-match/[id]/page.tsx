"use client";
import { useState } from "react";
import { useQuickMatch } from "@/hooks/useQuickMatch";
import { DefaultLoader } from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { QuickInitializeModal } from "../_components/QuickInitializeModal";
import { QuickNextInningModal } from "../_components/QuickNextInningModal";
import { QuickLiveScorecard } from "../_components/QuickLiveScorecard";
import { QuickHeroSection } from "../_components/QuickHeroSection";
import { QuickScorecardModal } from "../_components/QuickScorecardModal";
import { SectionHeader } from "@/components/layouts/SectionHeader";
import { EmptyState } from "@/components/cards/EmptyState";
import { ClipboardList, Swords, MapPin, Calendar, Activity, Zap, LucideIcon } from "lucide-react";
import { formatDate } from "@/utils/helper/formatDate";
import type { QuickToss } from "@/types/quick-match.props";

export default function QuickMatchIdPage() {
  const hook = useQuickMatch();

  const { match, isLoading, notFound, initializeFirstInning, startNextInning, setToss } = hook;

  const [isInitializing, setIsInitializing] = useState(false);
  const [isNextInning, setIsNextInning] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);

  if (isLoading) return <DefaultLoader />;

  if (notFound || !match) {
    return (
      <NotFoundParagraph
        redirect
        link="/quick-match"
        title="Match not found"
        description="This quick match could not be found in your browser storage."
      />
    );
  }

  // ── Toss + initialize handler ────────────────────────────────────────────
  const handleInitialize = (params: {
    toss: QuickToss;
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    battingTeamId: string;
    bowlingTeamId: string;
  }) => {
    setToss(params.toss);
    initializeFirstInning({
      strikerId: params.strikerId,
      nonStrikerId: params.nonStrikerId,
      bowlerId: params.bowlerId,
      battingTeamId: params.battingTeamId,
      bowlingTeamId: params.bowlingTeamId,
    });
    setIsInitializing(false);
  };

  const renderStatusAction = () => {
    switch (match.status) {
      case "not_started":
        return (
          <button onClick={() => setIsInitializing(true)} className="tab-pill">
            Initialize Match
          </button>
        );
      case "inning_completed":
        return (
          <button onClick={() => setIsNextInning(true)} className="tab-pill">
            Start 2nd Innings
          </button>
        );
      case "in_progress":
        return (
          <span className="tab-pill inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Live
          </span>
        );
      case "completed":
        return <span className="tab-pill">Completed</span>;
      default:
        return null;
    }
  };

  const teamA = match.teamA;
  const teamB = match.teamB;

  return (
    <div className="layout-background">
      {/* Hero banner */}
      <QuickHeroSection match={match} />

      <div className="mx-auto max-w-7xl space-y-10 px-4 pt-8">
        {/* Title + action row */}
        <div className="text-center">
          <div className="center mb-4 flex flex-col text-3xl font-black tracking-tighter uppercase italic md:text-5xl">
            <h1 className="text-start">{teamA.name}</h1>
            <span className="primary-heading pr-2 text-center">vs</span>
            <h1 className="text-end">{teamB.name}</h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {renderStatusAction()}

            <button
              onClick={() => {
                if (match.status !== "not_started") setIsScorecardOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-[urbanist] text-xs font-semibold text-slate-500 shadow-lg transition-all hover:text-green-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
            >
              <ClipboardList className="h-4 w-4" />
              Scorecard
            </button>
          </div>
        </div>

        {/* Live scorecard */}
        <div className="space-y-6">
          <SectionHeader title="Match" highlight="Center" />

          {match.status === "not_started" ? (
            <EmptyState
              icon={<Swords className="h-8 w-8 text-slate-300 dark:text-slate-600" />}
              title="Awaiting Toss"
              description="Tap 'Initialize Match' above to set the toss, pick opening players and start scoring."
            />
          ) : (
            <QuickLiveScorecard match={match} hook={hook} />
          )}
        </div>

        {/* Match info cards */}
        <div className="space-y-4">
          <SectionHeader title="Match" highlight="Details" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <InfoCard
              icon={MapPin}
              color="green"
              label="Ground"
              value={match.location || "TBD"}
              sub={`${match.venue.city}, ${match.venue.country}`}
            />
            <InfoCard
              icon={Activity}
              color="blue"
              label="Category"
              value={match.category}
              sub={`${match.overs} Overs`}
            />
            <InfoCard
              icon={Calendar}
              color="amber"
              label="Date"
              value={match.date ? formatDate(new Date(match.date)) : "TBD"}
              sub={match.status.replace(/_/g, " ")}
            />
            <InfoCard
              icon={Zap}
              color="purple"
              label="Quick Match"
              value="Guest Mode"
              sub="Stored in browser"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickInitializeModal
        isOpen={isInitializing}
        match={match}
        onConfirm={handleInitialize}
        onClose={() => setIsInitializing(false)}
      />

      <QuickNextInningModal
        isOpen={isNextInning}
        match={match}
        onConfirm={(params) => {
          startNextInning(params);
          setIsNextInning(false);
        }}
        onClose={() => setIsNextInning(false)}
      />

      {isScorecardOpen && (
        <QuickScorecardModal
          isOpen={isScorecardOpen}
          match={match}
          onClose={() => setIsScorecardOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Inline InfoCard (small, no external dep needed) ─────────────────────

const COLOR: Record<string, string> = {
  green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

function InfoCard({
  icon: Icon,
  color,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  color: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="hover-card group rounded-3xl border border-slate-200 p-6 shadow-lg dark:border-white/10">
      <div
        className={`mb-4 inline-flex rounded-xl p-2 transition-transform group-hover:scale-110 ${COLOR[color]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="label-xs mb-1">{label}</p>
      <p className="body-text text-sm font-black uppercase">{value}</p>
      {sub && <p className="meta-text mt-0.5 text-[10px]">{sub}</p>}
    </div>
  );
}
