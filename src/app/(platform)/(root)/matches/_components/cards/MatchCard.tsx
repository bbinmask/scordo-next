import type { MatchWithDetails } from "@/lib/types";
import { formatDate } from "@/utils/helper/formatDate";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import TeamAvatar from "@/components/TeamAvatar";
import { MatchStatusBadge } from "@/components/shared/MatchStatusBadge";

export const MatchCard = ({ match, link }: { match?: MatchWithDetails; link?: string }) => {
  if (!match) return null;

  const href = link ? link : `/matches/${match.id}`;

  return (
    <div>
      <div className="hover-card group relative flex h-52 w-72 flex-shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-300 p-6 dark:border-white/10">
        {/* Teams Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex -space-x-3">
            <TeamAvatar name={match.teamA.name} logo={match.teamA.logo} />
            <TeamAvatar name={match.teamB.name} logo={match.teamB.logo} zIndex />
          </div>
          <Link
            href={href}
            className="rounded-xl bg-slate-100 p-2.5 text-slate-400 transition-all hover:text-green-500 dark:bg-white/5"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Match Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-green-100 bg-green-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-green-600 uppercase dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
              {match.category.toUpperCase()}
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              • {match.overs} Overs
            </span>
          </div>
          <h3 className="truncate font-[poppins] text-lg font-black tracking-tight text-slate-900 uppercase transition-colors group-hover:text-green-500 dark:text-white">
            {match.teamA.abbreviation}{" "}
            <span className="font-inter mx-1 text-green-800 dark:text-green-700">vs</span>{" "}
            {match.teamB.abbreviation}
          </h3>
          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <MapPin className="h-3 w-3" /> {match.location}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
          {match.result ? (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Result: {match.result}
            </span>
          ) : (
            <>
              {match.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black tracking-tighter text-green-500 uppercase">
                    {formatDate(new Date(match.date))}
                  </span>
                </div>
              )}
              <MatchStatusBadge status={match.status} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
