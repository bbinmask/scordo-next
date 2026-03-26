"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Tournament, User } from "@/generated/prisma";
import { DefaultLoader } from "@/components/Spinner";
import { BentoCard } from "../../_components/cards/bento-card";
import {
  Trophy,
  Calendar,
  Users,
  ArrowUpRight,
  UserCircle2,
  ChevronRight,
  Compass,
} from "lucide-react";
import { formatDate } from "@/utils/helper/formatDate";

interface FriendTournament extends Tournament {
  organizer: { name: string; username: string; avatar: string | null };
  _count: { participatingTeams: number };
  friends: { name: string; username: string; avatar: string | null }[];
}

const statusBadge = (start: Date, end: Date) => {
  const now = new Date();
  if (now < new Date(start))
    return { label: "Upcoming", cls: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
  if (now > new Date(end))
    return { label: "Ended", cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return { label: "Live", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
};

const AvatarStack = ({ users }: { users: { name: string; avatar: string | null }[] }) => (
  <div className="flex -space-x-2">
    {users.slice(0, 4).map((u, i) => (
      <div
        key={i}
        className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-200 text-[10px] font-black text-slate-500 shadow dark:border-slate-900 dark:bg-slate-700"
      >
        {u.avatar ? (
          <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
        ) : (
          u.name[0].toUpperCase()
        )}
      </div>
    ))}
    {users.length > 4 && (
      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 font-[urbanist] text-[10px] font-black text-slate-500 dark:border-slate-900 dark:bg-slate-800">
        +{users.length - 4}
      </div>
    )}
  </div>
);

const FriendTournamentCard = ({ tournament }: { tournament: FriendTournament }) => {
  const badge = statusBadge(tournament.startDate, tournament.endDate);
  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <div className="hover-card group flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 transition-all dark:border-white/10 dark:bg-slate-900/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 font-[urbanist] text-[10px] font-black tracking-widest uppercase ${badge.cls}`}
              >
                {badge.label}
              </span>
              <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 font-[urbanist] text-[10px] font-black tracking-widest text-slate-400 uppercase dark:border-white/5 dark:bg-white/5">
                {tournament.details.totalOvers} Ov
              </span>
            </div>
            <h3 className="font-[poppins] text-lg font-black tracking-tight text-slate-800 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
              {tournament.title}
            </h3>
            <p className="mt-1 font-[urbanist] text-xs font-semibold text-slate-400">
              by{" "}
              <Link
                href={`/u/${tournament.organizer.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-green-500 hover:underline"
              >
                @{tournament.organizer.username}
              </Link>
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-slate-50 p-2 text-slate-300 transition-all group-hover:bg-green-50 group-hover:text-green-500 dark:bg-white/5 dark:group-hover:bg-green-500/10">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-green-500" />
              <span className="font-[urbanist] text-xs font-semibold">
                {formatDate(new Date(tournament.startDate))?.split(",")[0]}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="h-3.5 w-3.5 text-green-500" />
              <span className="font-[urbanist] text-xs font-semibold">
                {tournament._count.participatingTeams}/{tournament.details.maxTeams}
              </span>
            </div>
          </div>
          {tournament.friends?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-[urbanist] text-[10px] font-semibold text-slate-400">
                Friends in
              </span>
              <AvatarStack users={tournament.friends} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default function FriendsTournamentsPage() {
  const { data: tournaments, isLoading } = useQuery<FriendTournament[]>({
    queryKey: ["friends-tournaments"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tournaments/friends");
      if (!data.success) return [];
      return data.data;
    },
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <h2 className="flex items-center gap-3 font-[poppins] text-2xl font-black tracking-tight uppercase italic dark:text-white">
          Friends' <span className="primary-heading pr-2">Tournaments</span>
        </h2>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
      </div>

      <p className="font-[urbanist] text-sm font-semibold text-slate-400">
        Tournaments your friends are participating in or organizing.
      </p>

      {isLoading ? (
        <DefaultLoader />
      ) : !tournaments?.length ? (
        <div className="hover-card flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-200 py-20 text-center dark:border-white/10">
          <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
            <UserCircle2 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          </div>
          <div>
            <h3 className="font-[poppins] text-lg font-black tracking-tight text-slate-600 uppercase italic dark:text-white">
              Nothing Here Yet
            </h3>
            <p className="mt-1 font-[urbanist] text-sm font-semibold text-slate-400">
              None of your friends are in a tournament right now.
            </p>
          </div>
          <Link
            href="/tournaments/explore"
            className="flex items-center gap-1.5 font-[urbanist] text-sm font-bold text-green-500 hover:underline"
          >
            Explore all tournaments <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tournaments.map((t) => (
            <FriendTournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}
