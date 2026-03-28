import { Tournament } from "@/generated/prisma";
import { TournamentWithDetails } from "@/lib/types";
import { ArrowUpRight, Flame, Trophy, Users } from "lucide-react";

const TournamentCard = ({ tournament }: { tournament: TournamentWithDetails }) => (
  <div className="group relative h-64 w-80 flex-shrink-0">
    {/* Background Glow */}
    <div className="absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 blur transition duration-700 group-hover:opacity-20"></div>

    <div className="hover-card relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[2.2rem] border bg-white p-6 shadow-sm dark:border-white/10">
      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
            <Trophy size={20} className="text-green-600" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black tracking-widest text-emerald-600 uppercase">
              {tournament.status === "NOT_STARTED"
                ? "Registration Open"
                : tournament.status === "IN_PROGRESS"
                  ? "Live"
                  : tournament.status === "COMPLETED"
                    ? "Completed"
                    : tournament.status === "STOPPED"
                      ? "Stopped"
                      : "Canceled"}
            </span>
          </div>
        </div>

        <p className="mb-1 text-[9px] font-black tracking-[0.2em] text-green-600 uppercase">
          {tournament.details.season
            ? `Season 0${String(tournament.details.season)}`
            : "Circuit Premiere"}
        </p>
        <h3 className="truncate text-xl leading-none font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
          {String(tournament.title)}
        </h3>

        <div className="mt-3 flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 text-[9px] font-bold tracking-tight uppercase">
            <Users size={10} className="text-slate-500" />{" "}
            {String(tournament._count.participatingTeams)}/{String(tournament.details.maxTeams)}{" "}
            Teams
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1 text-[9px] font-bold tracking-tight uppercase">
            <Flame size={10} className="text-slate-500" /> {String(tournament.details.totalOvers)}{" "}
            Overs
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-slate-50 pt-4 dark:border-white/5">
        <div className="space-y-1">
          <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
            Entry Fee
          </p>
          <p className="text-sm font-black tracking-tighter text-slate-900 dark:text-white">
            ₹{tournament.details.entryFee?.toLocaleString() || "TBD"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
            Prize Pool
          </p>
          <p className="text-sm font-black tracking-tighter text-slate-900 dark:text-white">
            ₹{tournament.details.winnerPrice?.toLocaleString() || "TBD"}
          </p>
        </div>
        <button className="cursor-pointer rounded-2xl bg-green-700 p-3 text-white shadow-xl transition-all hover:scale-110 active:scale-95">
          <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  </div>
);

export default TournamentCard;
