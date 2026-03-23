"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
  Suspense,
  RefAttributes,
  ForwardRefExoticComponent,
} from "react";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Users,
  Shield,
  Trophy,
  Swords,
  UserCheck,
  Globe,
  Sparkles,
  ArrowUpRight,
  Flame,
  Activity,
  LayoutGrid,
  Zap,
  TrendingUp,
  Link,
  LucideProps,
  ArrowRight,
} from "lucide-react";
import AfterSearch from "./_components/AfterSearch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SearchBar from "./_components/SearchBar";
import Spinner from "@/components/Spinner";

const filters = [
  { label: "All", value: "all", icon: Search },
  { label: "Users", value: "users", icon: Users },
  { label: "Teams", value: "teams", icon: Shield },
  { label: "Matches", value: "matches", icon: Swords },
  { label: "Tournaments", value: "tournaments", icon: Trophy },
] as const;

const ExplorePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "users" | "teams" | "tournaments" | "matches"
  >("all");

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

  const results = {
    users: usersQuery.data ?? [],
    teams: teamsQuery.data ?? [],
    matches: matchesQuery.data ?? [],
    tournaments: tournamentsQuery.data ?? [],
  };

  const clearSearch = () => {
    setQuery("");
    router.replace(pathname);
  };

  const isLoading = usersQuery.isLoading || teamsQuery.isLoading || tournamentsQuery.isLoading;

  return (
    <div className="min-h-full rounded-xl font-sans">
      <div className="relative mx-auto">
        {/* Search Bar */}

        <Suspense fallback={<Spinner />}>
          <SearchBar query={query} setQuery={setQuery} />
        </Suspense>

        {/* Filters */}
        <div className="mt-3 flex justify-center overflow-hidden rounded-lg border">
          {filters.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-semibold transition ${
                activeFilter === value
                  ? "bg-green-700 text-white"
                  : "bg-gray-50 text-green-800 hover:bg-green-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {query.trim() === "" ? (
        <div className="mx-auto mt-4 max-w-7xl border p-4 md:p-8">
          {/* <Carousel status="Live" matches={[]} /> */}
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
  );
};

type Category = "all" | "teams" | "matches" | "users" | "tournaments";

interface ExploreItem {
  id: string;
  type: Category;
  title: string;
  subtitle: string;
  meta: string;
  image?: string | null;
  status?: string;
  badge?: string;
  trending?: boolean;
}

/**
 * Tactical Category Chip
 */
const CategoryChip = ({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-2xl border px-6 py-3 font-sans whitespace-nowrap transition-all duration-300 ${
      active
        ? "scale-105 border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
        : "border-slate-200 bg-white text-slate-500 hover:border-emerald-500/50 dark:border-white/5 dark:bg-slate-900"
    }`}
  >
    <Icon size={16} className={active ? "animate-pulse" : ""} />
    <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
  </button>
);

/**
 * Result Card - Multi-type dynamic layout
 */

interface SearchResultItemProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  subtitle: string;
  href?: string;
}
const ResultCard = ({ icon: Icon, title, subtitle, href = "#" }: SearchResultItemProps) => (
  <Link
    href={href}
    target="_blank"
    className="group flex items-center rounded-lg p-3 transition-colors duration-200 hover:bg-white/20 dark:hover:bg-black/20"
  >
    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 dark:bg-black/20">
      <Icon className="h-5 w-5 text-yellow-500" />
    </div>
    <div>
      <p className="font-bold text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
    <ArrowRight className="ml-auto h-5 w-5 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-400" />
  </Link>
);

// --- Main Explore Hub Component ---

export const ExploreHub = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "users" | "teams" | "tournaments" | "matches"
  >("all");

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

  const results = {
    users: usersQuery.data ?? [],
    teams: teamsQuery.data ?? [],
    matches: matchesQuery.data ?? [],
    tournaments: tournamentsQuery.data ?? [],
  };

  const clearSearch = () => {
    setQuery("");
    router.replace(pathname);
  };

  const isLoading = usersQuery.isLoading || teamsQuery.isLoading || tournamentsQuery.isLoading;

  // Initial Discovery Data (Catching User Attention)
  const initialData: ExploreItem[] = useMemo(
    () => [
      {
        id: "t1",
        type: "tournaments",
        title: "Winter Ashes 2026",
        subtitle: "24 Teams competing in regional circuit",
        meta: "PREMIER LEAGUE",
        trending: true,
        status: "Registering",
        badge: "10K Prize",
      },
      {
        id: "m1",
        type: "matches",
        title: "Apex vs Shadow",
        subtitle: "Grand Finale - MCG Stadium",
        meta: "LIVE MATCH",
        status: "Live",
        trending: true,
      },
      {
        id: "u1",
        type: "users",
        title: "Irfan Ul Madar",
        subtitle: "Top All-rounder // 2400 Rating",
        meta: "ELITE OPERATIVE",
        badge: "Verified",
        trending: false,
      },
      {
        id: "s1",
        type: "teams",
        title: "Neon Strike",
        subtitle: "Singapore National Club",
        meta: "SQUAD // @NSV",
        trending: true,
        status: "Active",
      },
      {
        id: "t2",
        type: "tournaments",
        title: "Test Championship",
        subtitle: "The ultimate red ball challenge",
        meta: "TIER 1",
        status: "Upcoming",
      },
      {
        id: "u2",
        type: "users",
        title: "Zephyr Strike",
        subtitle: "Scorer & Official",
        meta: "OFFICIAL CORE",
        badge: "Pro",
      },
    ],
    []
  );

  const filteredResults = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === "all" || item.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [query, activeCategory, initialData, isLoading]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 font-sans text-slate-900 transition-colors duration-500 md:p-8 dark:bg-[#020617] dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Header & Tactical Search */}
        <header className="animate-in fade-in slide-in-from-top-4 mb-12 space-y-8 duration-700">
          <div className="flex flex-col items-end justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row dark:border-white/5">
            <div>
              <h2 className="mb-2 text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase">
                Global Discovery
              </h2>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic md:text-7xl dark:text-white">
                Explore <span className="text-emerald-500">Hub</span>
              </h1>
            </div>
          </div>

          {/* SearchBar */}

          <Suspense>
            <SearchBar query={query} setQuery={setQuery} />
          </Suspense>

          {/* Categories Filter */}
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-2 pb-4">
            <CategoryChip
              label="All Access"
              icon={LayoutGrid}
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            <CategoryChip
              label="Teams"
              icon={Shield}
              active={activeCategory === "teams"}
              onClick={() => setActiveCategory("teams")}
            />
            <CategoryChip
              label="Matches"
              icon={Swords}
              active={activeCategory === "matches"}
              onClick={() => setActiveCategory("matches")}
            />
            <CategoryChip
              label="Users"
              icon={UserCheck}
              active={activeCategory === "users"}
              onClick={() => setActiveCategory("users")}
            />
            <CategoryChip
              label="Leagues"
              icon={Trophy}
              active={activeCategory === "tournaments"}
              onClick={() => setActiveCategory("tournaments")}
            />
          </div>
        </header>

        {/* MAIN GRID - RESULTS & TRENDING */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Result Feed */}
          <div className="space-y-8 lg:col-span-8">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-black tracking-tighter text-slate-400 uppercase italic">
                Broadcast Feed
              </h3>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                {results.users?.length} results
              </span>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-1000 md:grid-cols-2">
              {results.users?.length > 0 ? (
                results.users.map((item) => (
                  <ResultCard
                    icon={UserCheck}
                    key={item.id}
                    title={item.name}
                    subtitle={item.username}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/40 py-20 text-center backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                  <Zap size={48} className="mx-auto mb-4 animate-pulse text-slate-300" />
                  <p className="text-sm font-black tracking-widest text-slate-400 uppercase">
                    Tactical data out of range
                  </p>
                  <button
                    onClick={clearSearch}
                    className="mt-4 text-xs font-black tracking-[0.2em] text-emerald-500 uppercase hover:underline"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Featured Bento */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Featured Tournament Card */}
            <div className="group relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 text-white shadow-2xl">
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
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-[10px] font-black tracking-widest text-indigo-600 uppercase shadow-xl transition-all hover:translate-x-1 active:scale-95">
                  Initialize Entry <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Quick Stats / Trending Bento */}
            <div className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="mb-8 flex items-center gap-3">
                <TrendingUp size={20} className="text-emerald-500" />
                <h3 className="text-sm font-black tracking-widest uppercase">Trending Insights</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Active Fixtures", value: "24", sub: "Global BROADCAST" },
                  { label: "New Operatives", value: "+142", sub: "LAST 24 HOURS" },
                  { label: "Squad Deployments", value: "1.2K", sub: "TOTAL ROSTERS" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-end justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0 dark:border-white/5"
                  >
                    <div>
                      <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        {stat.label}
                      </p>
                      <p className="text-[8px] font-bold tracking-tighter text-emerald-500/70 uppercase">
                        {stat.sub}
                      </p>
                    </div>
                    <p className="text-3xl leading-none font-black tracking-tighter text-slate-900 italic dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="rounded-[2.5rem] border border-white/5 bg-slate-950 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Scordo Infrastructure
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-black text-emerald-500">SECURE</span>
                </div>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[88%] rounded-full bg-indigo-500" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ExploreHub;
