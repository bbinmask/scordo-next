import { Carousel } from "@/components/carousel";
import { ExploreResultsProps } from "@/types/index.props";
import {
  ArrowUpRight,
  Flame,
  Globe,
  MonitorPlay,
  Shield,
  Sparkles,
  Trophy,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

type Category = "all" | "teams" | "matches" | "users" | "tournaments";

interface ExploreItem {
  id: string;
  type: Category;
  title: string;
  subtitle: string;
  href: string;
  meta: string;
  image?: string | null;
  status?: string;
  badge?: string | null;
  trending?: boolean;
}

const ResultCard = ({ item }: { item: ExploreItem }) => {
  const Icon =
    {
      teams: Shield,
      matches: MonitorPlay,
      users: UserCheck,
      tournaments: Trophy,
      all: Sparkles,
    }[item.type] || Globe;

  return (
    <div className="group relative min-w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">
      <div className="absolute top-0 right-0 p-4">
        {item.trending && (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2 py-1 text-amber-600">
            <Flame size={12} className="animate-bounce" />
            <span className="text-[8px] font-black uppercase">Trending</span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-start gap-5">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition-transform group-hover:scale-110 dark:border-white/5 dark:bg-slate-800">
            {item.image ? (
              <img src={item.image} className="h-full w-full object-cover" alt={item.title} />
            ) : (
              <Icon size={28} className="text-slate-300 dark:text-slate-600" />
            )}
          </div>
          <div
            className={`absolute -right-1 -bottom-1 rounded-lg border-2 border-white p-1 text-white shadow-lg dark:border-slate-900 ${
              item.type === "teams"
                ? "bg-indigo-500"
                : item.type === "tournaments"
                  ? "bg-emerald-500"
                  : "bg-slate-400"
            }`}
          >
            <Icon size={10} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[9px] font-semibold tracking-widest text-emerald-500 uppercase">
            {item.meta}
          </p>
          <h3 className="truncate font-[poppins] text-sm font-semibold text-slate-900 uppercase dark:text-white">
            {item.title}
          </h3>
          <p
            className={`mt-1 truncate text-[10px] font-medium text-slate-400 ${item.type === "users" ? "lowercase" : "uppercase"}`}
          >
            {item.subtitle}
          </p>
        </div>

        <Link
          href={item.href}
          className="self-center rounded-xl bg-slate-50 p-2.5 text-slate-400 transition-all hover:bg-emerald-500/10 hover:text-emerald-500 dark:bg-white/5"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>

      {item.status && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full ${item.status === "Live" ? "animate-pulse bg-red-500" : "bg-emerald-500"}`}
            />
            <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">
              {item.status}
            </span>
          </div>
          {item.badge && (
            <span className="rounded-md bg-indigo-500/5 px-2 py-0.5 text-[9px] font-bold text-indigo-400 uppercase">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const InitialResultsList = ({
  data,
  filter,
}: {
  data?: ExploreResultsProps;
  filter: Category;
}) => {
  if (!data) return;

  const { users, matches, teams, tournaments } = data;

  return (
    <div className="space-y-2">
      {users.length > 0 && (filter === "all" || filter === "users") && (
        <Carousel>
          {users.map((item) => (
            <ResultCard key={item.id} item={item} />
          ))}
        </Carousel>
      )}
      {teams.length > 0 && (filter === "all" || filter === "teams") && (
        <Carousel>
          {teams.map((item) => (
            <ResultCard item={item} key={item.id} />
          ))}
        </Carousel>
      )}
      {matches.length > 0 && (filter === "all" || filter === "matches") && (
        <Carousel>
          {matches.map((item) => (
            <ResultCard item={item} key={item.id} />
          ))}
        </Carousel>
      )}
      {tournaments.length > 0 && (filter === "all" || filter === "tournaments") && (
        <Carousel>
          {tournaments.map((item) => (
            <ResultCard item={item} key={item.id} />
          ))}
        </Carousel>
      )}
    </div>
  );
};
