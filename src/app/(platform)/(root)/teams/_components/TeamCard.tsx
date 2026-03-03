import { heroImages } from "@/constants/urls";
import { TeamWithPlayers } from "@/lib/types";
import TeamProps from "@/types/teams.props";
import { ArrowUpRight, PlayCircle, Shield, Trophy, Users } from "lucide-react";
import Link from "next/link";

interface TeamCardProps {
  team: TeamWithPlayers;
}

const TeamCard = ({ team }: TeamCardProps) => {
  if (!team) return null;

  const { name, abbreviation, logo, players } = team;

  return (
    <div
      className={`group hover-card relative flex h-48 w-80 flex-shrink-0 flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-all duration-500`}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 dark:border-white/10 dark:bg-slate-950">
            {logo ? (
              <img src={logo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <Trophy className="h-7 w-7 text-green-500/80 dark:text-green-400/80" />
              </div>
            )}
          </div>
          <div className="absolute -right-1.5 -bottom-1.5 rounded-xl bg-green-600 p-1.5 text-white shadow-xl dark:bg-green-500">
            <Shield className="h-3 w-3" />
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/teams/${team.abbreviation}`}
            className="group/btn flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/50 px-3 py-2 text-slate-500 shadow-sm transition-all duration-300 hover:bg-white hover:text-green-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-green-600 dark:hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-green-600 uppercase dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
            {abbreviation || "PRO"}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-tighter text-slate-500 uppercase dark:text-slate-400">
            <Users className="h-3.5 w-3.5" />
            {players.length || 0} Members
          </div>
        </div>

        <h3 className="font-inter dark:group-hover:text-green-40 truncate text-lg font-bold tracking-tight text-slate-900 uppercase transition-colors duration-300 group-hover:text-green-600 dark:text-white">
          {name || "Unnamed Team"}
        </h3>
      </div>
    </div>
  );
};
export default TeamCard;
