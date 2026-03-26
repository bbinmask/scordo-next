"use client";

import React, { useState, useMemo, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  Trophy,
  Swords,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  LayoutGrid,
  Zap,
} from "lucide-react";
import AfterSearch from "./_components/AfterSearch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SearchBar from "./_components/SearchBar";
import Link from "next/link";
import { ExploreResultsProps } from "@/types/index.props";
import { InitialResultsList } from "./_components/Results";
import { CategoryChip } from "./_components/CategoryChip";
type Category = "all" | "teams" | "matches" | "users" | "tournaments";

export const ExploreHub = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Category>("all");

  const usersQuery = useQuery({
    queryKey: ["search-users", query],
    queryFn: async () => {
      const { data } = await axios.get(`/api/search/users?query=${query}`);

      return data.data;
    },
    enabled: query.trim().length > 0 && (activeFilter === "all" || activeFilter === "users"),
  });

  const teamsQuery = useQuery({
    queryKey: ["search-teams", query],
    queryFn: async () => {
      const { data } = await axios.get(`/api/search/teams?query=${query}`);
      return data.data;
    },

    enabled: query.trim().length > 0 && (activeFilter === "all" || activeFilter === "teams"),
  });

  const matchesQuery = useQuery({
    queryKey: ["search-matches", query],
    queryFn: async () => {
      const { data } = await axios.get(`/api/search/matches?query=${query}`);
      return data.data;
    },

    enabled: query.trim().length > 0 && (activeFilter === "all" || activeFilter === "matches"),
  });

  const tournamentsQuery = useQuery({
    queryKey: ["search-tournaments", query],
    queryFn: async () => {
      const { data } = await axios.get(`/api/search/tournaments?query=${query}`);

      return data.data;
    },
    enabled: query.trim().length > 0 && (activeFilter === "all" || activeFilter === "tournaments"),
  });

  const results = useMemo(() => {
    return {
      users: usersQuery.data ?? [],
      teams: teamsQuery.data ?? [],
      matches: matchesQuery.data ?? [],
      tournaments: tournamentsQuery.data ?? [],
    };
  }, [
    usersQuery.isLoading,
    matchesQuery.isLoading,
    teamsQuery.isLoading,
    tournamentsQuery.isLoading,
  ]);

  const { data: initialData } = useQuery<ExploreResultsProps>({
    queryKey: ["explore-page-data"],
    queryFn: async () => {
      const { data } = await axios.get("/api/explore/");

      if (!data.success) return null;

      return data.data;
    },
  });

  const clearSearch = () => {
    setQuery("");
    router.replace(pathname);
  };

  const isLoading = usersQuery.isLoading || teamsQuery.isLoading || tournamentsQuery.isLoading;

  return (
    <div className="min-h-screen p-4 font-sans text-slate-900 transition-colors duration-500 md:p-8 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Header & Tactical Search */}
        <div className="animate-in fade-in slide-in-from-top-4 mb-12 space-y-8 duration-700">
          {/* SearchBar */}

          <Suspense>
            <SearchBar query={query} setQuery={setQuery} />
          </Suspense>

          {/* Categories Filter */}
          <div className="hide_scrollbar flex gap-4 overflow-x-auto px-2 py-4">
            <CategoryChip
              label="All Access"
              icon={LayoutGrid}
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            <CategoryChip
              label="Teams"
              icon={Shield}
              active={activeFilter === "teams"}
              onClick={() => setActiveFilter("teams")}
            />
            <CategoryChip
              label="Matches"
              icon={Swords}
              active={activeFilter === "matches"}
              onClick={() => setActiveFilter("matches")}
            />
            <CategoryChip
              label="Users"
              icon={UserCheck}
              active={activeFilter === "users"}
              onClick={() => setActiveFilter("users")}
            />
            <CategoryChip
              label="Leagues"
              icon={Trophy}
              active={activeFilter === "tournaments"}
              onClick={() => setActiveFilter("tournaments")}
            />
          </div>
        </div>

        {/* MAIN GRID - RESULTS & TRENDING */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column: Result Feed */}
          <div className="container-bg relative space-y-12 overflow-hidden rounded-3xl border-2 border-slate-200 py-6 shadow-sm lg:col-span-2 dark:border-white/10">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-black tracking-tighter text-slate-400 uppercase italic">
                Broadcast Feed
              </h3>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                {results.users?.length} results
              </span>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 w-full gap-6 duration-1000">
              {query.trim().length === 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-1000">
                  {initialData ? (
                    <InitialResultsList filter={activeFilter} data={initialData} />
                  ) : (
                    <div className="col-span-full rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/40 py-20 text-center backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                      <Zap size={48} className="mx-auto mb-4 animate-pulse text-slate-300" />
                      <p className="text-sm font-black tracking-widest text-slate-400 uppercase">
                        Tactical data out of range
                      </p>
                      <button
                        onClick={() => setQuery("")}
                        className="mt-4 text-xs font-black tracking-[0.2em] text-emerald-500 uppercase hover:underline"
                      >
                        Reset Search Spectrum
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <AfterSearch
                  query={query}
                  clearSearch={clearSearch}
                  isLoading={isLoading}
                  results={results}
                  filter={activeFilter}
                />
              )}
            </div>
          </div>

          {/* Right Column: Featured Bento */}
          <aside className="space-y-8">
            {/* Featured Tournament Card */}
            <div className="group relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-green-700 to-green-800 p-8 text-white shadow-2xl">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <Trophy className="absolute -bottom-4 -left-4 h-32 w-32 text-white/5 transition-transform duration-1000 group-hover:rotate-12" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
                  <Sparkles size={12} className="text-amber-300" />
                  <span className="text-[9px] font-black tracking-widest uppercase">
                    Featured Tournament
                  </span>
                </div>
                <h3 className="mb-2 text-3xl leading-none font-black tracking-tighter uppercase italic">
                  Global Ashes
                </h3>
                <p className="mb-8 text-xs leading-relaxed font-medium text-indigo-100/70">
                  The most anticipated 20-over circuit of the season is now accepting tactical
                  applications. Establish your legacy.
                </p>
                <Link
                  href="/tournaments/create"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-[10px] font-black tracking-widest text-slate-900 uppercase shadow-xl transition-all active:scale-95"
                >
                  Create Tournament <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ExploreHub;
