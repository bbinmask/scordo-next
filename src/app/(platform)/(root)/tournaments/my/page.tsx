"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Tournament, TournamentTeam } from "@/generated/prisma";
import { DefaultLoader } from "@/components/Spinner";
import { BentoCard } from "../../_components/cards/bento-card";
import {
  Trophy,
  Calendar,
  Users,
  PlusCircle,
  ArrowUpRight,
  Flag,
  Layers,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/utils/helper/formatDate";

interface TournamentWithCount extends Tournament {
  _count: { participatingTeams: number };
}

const statusBadge = (start: Date, end: Date) => {
  const now = new Date();
  if (now < new Date(start))
    return { label: "Upcoming", cls: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
  if (now > new Date(end))
    return { label: "Ended", cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return { label: "Live", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
};

const TournamentCard = ({ tournament }: { tournament: TournamentWithCount }) => {
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
            {tournament.description && (
              <p className="mt-1 line-clamp-2 font-[urbanist] text-sm font-semibold text-slate-400">
                {tournament.description}
              </p>
            )}
          </div>
          <div className="shrink-0 rounded-xl bg-slate-50 p-2 text-slate-300 transition-all group-hover:bg-green-50 group-hover:text-green-500 dark:bg-white/5 dark:group-hover:bg-green-500/10">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-green-500" />
            <span className="truncate font-[urbanist] text-xs font-semibold">
              {formatDate(new Date(tournament.startDate))?.split(",")[0]}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="h-3.5 w-3.5 shrink-0 text-green-500" />
            <span className="font-[urbanist] text-xs font-semibold">
              {tournament._count.participatingTeams}/{tournament.details.maxTeams} teams
            </span>
          </div>
          {tournament.details.entryFee != null && (
            <div className="flex items-center gap-2 text-slate-500">
              <Flag className="h-3.5 w-3.5 shrink-0 text-green-500" />
              <span className="font-[urbanist] text-xs font-semibold">
                {tournament.details.entryFee === 0 ? "Free" : `₹${tournament.details.entryFee}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="hover-card flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-200 py-20 text-center dark:border-white/10">
    <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
      <Trophy className="h-10 w-10 text-slate-300 dark:text-slate-600" />
    </div>
    <div>
      <h3 className="font-[poppins] text-lg font-black tracking-tight text-slate-600 uppercase italic dark:text-white">
        No Tournaments Yet
      </h3>
      <p className="mt-1 font-[urbanist] text-sm font-semibold text-slate-400">{message}</p>
    </div>
    <Link
      href="/tournaments/create"
      className="primary-btn flex items-center gap-2 rounded-2xl px-6 py-2.5 font-[urbanist] text-sm font-bold"
    >
      <PlusCircle className="h-4 w-4" />
      Create Tournament
    </Link>
  </div>
);

export default function MyTournamentsPage() {
  const { data: organized, isLoading: orgLoading } = useQuery<TournamentWithCount[]>({
    queryKey: ["tournaments-organized"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tournaments/organized");
      if (!data.success) return [];
      return data.data;
    },
  });

  const { data: joined, isLoading: joinedLoading } = useQuery<TournamentWithCount[]>({
    queryKey: ["tournaments-joined"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tournaments/joined");
      if (!data.success) return [];
      return data.data;
    },
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Organized */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-3 font-[poppins] text-2xl font-black tracking-tight uppercase italic dark:text-white">
            Organized <span className="primary-heading pr-2">By Me</span>
          </h2>
          <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
          <Link
            href="/tournaments/create"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2 font-[urbanist] text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-green-500 hover:text-green-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New
          </Link>
        </div>

        {orgLoading ? (
          <DefaultLoader />
        ) : !organized?.length ? (
          <EmptyState message="You haven't organized any tournaments yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {organized.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </section>

      {/* Joined */}
      <section>
        <div className="mb-5 flex items-center gap-4">
          <h2 className="flex items-center gap-3 font-[poppins] text-2xl font-black tracking-tight uppercase italic dark:text-white">
            Teams <span className="primary-heading pr-2">Entered</span>
          </h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
        </div>

        {joinedLoading ? (
          <DefaultLoader />
        ) : !joined?.length ? (
          <div className="hover-card flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-slate-200 py-16 text-center dark:border-white/10">
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
              <Layers className="h-9 w-9 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-[urbanist] text-sm font-semibold text-slate-400">
              None of your teams are in a tournament yet.
            </p>
            <Link
              href="/tournaments/explore"
              className="flex items-center gap-1 font-[urbanist] text-sm font-bold text-green-500 hover:underline"
            >
              Browse tournaments <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {joined.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
