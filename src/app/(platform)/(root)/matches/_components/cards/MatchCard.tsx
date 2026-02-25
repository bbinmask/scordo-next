import { MatchWithDetails } from "@/lib/types";
import { formatDate } from "@/utils/helper/formatDate";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export const MatchCard = ({ match }: { match?: MatchWithDetails }) => {
  if (!match) return null;

  return (
    <div className="group relative h-56 w-80 flex-shrink-0 p-1">
      <div className="hover-card relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[2rem] p-6">
        {/* Visual Versus Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex -space-x-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-50 bg-white shadow-lg dark:border-[#020617] dark:bg-slate-800">
              <img
                src={
                  match.teamA.logo ||
                  `https://placehold.co/48x48/A62626/FFFFFF?text=${match.teamA.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}`
                }
                className="h-full w-full object-cover"
                alt="Team A"
              />
            </div>
            <div className="z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-50 bg-white shadow-lg dark:border-[#020617] dark:bg-slate-800">
              <img
                src={
                  match.teamB.logo ||
                  `https://placehold.co/48x48/A62626/FFFFFF?text=${match.teamB.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}`
                }
                className="h-full w-full object-cover"
                alt="Team B"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/matches/${match.id}`}
              className="rounded-xl bg-slate-100 p-2.5 text-slate-400 transition-all hover:text-green-500 dark:bg-white/5"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
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

        {/* Footer Status */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
          {match.result ? (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Result: {match.result}
            </span>
          ) : (
            <>
              {match?.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black tracking-tighter text-green-500 uppercase">
                    {formatDate(new Date(match.date))}
                  </span>
                </div>
              )}
              <span className="inline-flex animate-pulse items-center gap-1 text-[9px] font-black text-green-500 uppercase italic">
                {match.status === "in_progress" ? (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-red-500">Live Feed</span>
                  </>
                ) : match.status === "not_started" ? (
                  <span className="text-slate-500">Not Started</span>
                ) : match.status === "completed" ? (
                  <span className="text-slate-500">Completed</span>
                ) : (
                  "Unknown"
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
