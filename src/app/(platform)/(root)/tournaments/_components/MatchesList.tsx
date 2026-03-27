"use client";

import Link from "next/link";
import { Match, Team } from "@/generated/prisma";
import { formatDate } from "@/utils/helper/formatDate";
import { Activity, ArrowUpRight, Calendar } from "lucide-react";

type MatchEntry = Match & {
  teamA: Pick<Team, "id" | "name" | "abbreviation" | "logo">;
  teamB: Pick<Team, "id" | "name" | "abbreviation" | "logo">;
};

interface MatchesListProps {
  matches: MatchEntry[];
}

const statusConfig = {
  in_progress:       { label: "Live",      cls: "bg-red-500/10 text-red-500 border-red-500/20",    dot: true  },
  not_started:       { label: "Upcoming",  cls: "bg-blue-500/10 text-blue-500 border-blue-500/20",  dot: false },
  inning_completed:  { label: "Live",      cls: "bg-red-500/10 text-red-500 border-red-500/20",    dot: true  },
  completed:         { label: "Completed", cls: "bg-slate-500/10 text-slate-400 border-slate-200",  dot: false },
  stopped:           { label: "Stopped",   cls: "bg-amber-500/10 text-amber-500 border-amber-500/20", dot: false },
} as const;

const TeamBadge = ({ team }: { team: MatchEntry["teamA"] }) => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800">
      {team.logo ? (
        <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-[poppins] text-[10px] font-black text-slate-500">
          {team.abbreviation.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
    <span className="font-[poppins] text-sm font-black text-slate-800 dark:text-white">
      {team.abbreviation}
    </span>
  </div>
);

const MatchRow = ({ match }: { match: MatchEntry }) => {
  const cfg = statusConfig[match.status as keyof typeof statusConfig] ?? statusConfig.not_started;

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="hover-card group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all dark:border-white/10 dark:bg-slate-900/50">
        {/* Teams */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <TeamBadge team={match.teamA} />
          <span className="primary-heading shrink-0 font-[poppins] text-xs font-black">vs</span>
          <TeamBadge team={match.teamB} />
        </div>

        {/* Result / date */}
        <div className="hidden shrink-0 text-right md:block">
          {match.result ? (
            <p className="font-[urbanist] text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-[180px] truncate">
              {match.result}
            </p>
          ) : match.date ? (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-[urbanist] text-xs font-semibold">
                {formatDate(new Date(match.date))}
              </span>
            </div>
          ) : null}
        </div>

        {/* Status badge */}
        <div className="shrink-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-[urbanist] text-[10px] font-black uppercase tracking-widest ${cfg.cls}`}>
            {cfg.dot && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />}
            {cfg.label}
          </span>
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-green-500" />
      </div>
    </Link>
  );
};

export function MatchesList({ matches }: MatchesListProps) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
          <Activity className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="font-[urbanist] text-sm font-semibold text-slate-400">
          No matches scheduled yet.
        </p>
      </div>
    );
  }

  const groups = [
    { key: "live",      label: "Live",      items: matches.filter((m) => m.status === "in_progress" || m.status === "inning_completed") },
    { key: "upcoming",  label: "Upcoming",  items: matches.filter((m) => m.status === "not_started") },
    { key: "completed", label: "Completed", items: matches.filter((m) => m.status === "completed") },
    { key: "stopped",   label: "Stopped",   items: matches.filter((m) => m.status === "stopped") },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      {groups.map(({ key, label, items }) => (
        <div key={key}>
          <h4 className="mb-3 font-[poppins] text-xs font-black uppercase tracking-widest text-slate-400">
            {label} · {items.length}
          </h4>
          <div className="space-y-2">
            {items.map((m) => (
              <MatchRow key={m.id} match={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
