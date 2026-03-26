"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Tournament } from "@/generated/prisma";
import { DefaultLoader } from "@/components/Spinner";
import {
  Search,
  Trophy,
  Calendar,
  Users,
  ArrowUpRight,
  Flag,
  SlidersHorizontal,
  X,
  MapPin,
} from "lucide-react";
import { formatDate } from "@/utils/helper/formatDate";
import { useDebounceValue } from "usehooks-ts";

interface TournamentResult extends Tournament {
  organizer: { name: string };
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

const filterOptions = ["All", "Upcoming", "Live", "Ended"] as const;
type Filter = (typeof filterOptions)[number];

export default function ExploreTournamentsPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [debouncedQuery] = useDebounceValue(query, 300);

  const { data: tournaments, isLoading } = useQuery<TournamentResult[]>({
    queryKey: ["explore-tournaments", debouncedQuery],
    queryFn: async () => {
      const { data } = await axios.get(`/api/search/tournaments?query=${debouncedQuery}`);
      if (!data.success) return [];
      return data.data;
    },
  });

  const filtered = (tournaments ?? []).filter((t) => {
    if (activeFilter === "All") return true;
    const now = new Date();
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    if (activeFilter === "Upcoming") return now < start;
    if (activeFilter === "Live") return now >= start && now <= end;
    if (activeFilter === "Ended") return now > end;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h2 className="flex items-center gap-3 font-[poppins] text-2xl font-black tracking-tight uppercase italic dark:text-white">
          Explore <span className="primary-heading pr-2">Tournaments</span>
        </h2>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
      </div>

      {/* Search + Filters Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tournaments by name…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-10 pl-10 font-[urbanist] text-sm font-semibold text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/5">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-xl px-4 py-2 font-[urbanist] text-xs font-bold transition-all ${
                activeFilter === f
                  ? "bg-white text-green-600 shadow dark:bg-green-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="font-[urbanist] text-xs font-semibold text-slate-400">
          {filtered.length} tournament{filtered.length !== 1 ? "s" : ""} found
          {query && ` for "${query}"`}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <DefaultLoader />
      ) : !filtered.length ? (
        <div className="hover-card flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-200 py-20 text-center dark:border-white/10">
          <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
            <Trophy className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          </div>
          <div>
            <h3 className="font-[poppins] text-lg font-black tracking-tight text-slate-600 uppercase italic dark:text-white">
              No Results
            </h3>
            <p className="mt-1 font-[urbanist] text-sm font-semibold text-slate-400">
              {query ? "Try a different search term." : "No tournaments available right now."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const badge = statusBadge(t.startDate, t.endDate);
            const spotsLeft = t.details.maxTeams - t._count.participatingTeams;
            return (
              <Link key={t.id} href={`/tournaments/${t.id}`}>
                <div className="hover-card group flex h-full flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 transition-all dark:border-white/10 dark:bg-slate-900/50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 font-[urbanist] text-[10px] font-black tracking-widest uppercase ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                        <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 font-[urbanist] text-[10px] font-black tracking-widest text-slate-400 uppercase dark:border-white/5 dark:bg-white/5">
                          {t.details.totalOvers} Ov
                        </span>
                      </div>
                      <h3 className="font-[poppins] text-base font-black tracking-tight text-slate-800 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                        {t.title}
                      </h3>
                      <p className="mt-0.5 font-[urbanist] text-xs font-semibold text-slate-400">
                        by {t.organizer.name}
                      </p>
                    </div>
                    <div className="shrink-0 rounded-xl bg-slate-50 p-2 text-slate-300 transition-all group-hover:bg-green-50 group-hover:text-green-500 dark:bg-white/5 dark:group-hover:bg-green-500/10">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  {t.description && (
                    <p className="line-clamp-2 font-[urbanist] text-xs font-semibold text-slate-400">
                      {t.description}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-green-500" />
                      <span className="font-[urbanist] text-xs font-semibold">
                        {formatDate(new Date(t.startDate))?.split(",")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users className="h-3.5 w-3.5 text-green-500" />
                      <span className="font-[urbanist] text-xs font-semibold">
                        {t._count.participatingTeams}/{t.details.maxTeams} teams
                      </span>
                    </div>
                    {t.details.location && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-green-500" />
                        <span className="max-w-[100px] truncate font-[urbanist] text-xs font-semibold">
                          {t.details.location.city}
                        </span>
                      </div>
                    )}
                    {spotsLeft > 0 && badge.label === "Upcoming" && (
                      <span className="ml-auto rounded-full bg-green-50 px-2 py-0.5 font-[urbanist] text-[10px] font-black text-green-600 dark:bg-green-500/10 dark:text-green-400">
                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
