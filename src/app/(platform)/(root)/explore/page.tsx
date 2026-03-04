"use client";

import React, { useState, useEffect, ChangeEvent, useMemo, Suspense } from "react";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Users, Shield, Trophy, Swords } from "lucide-react";
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

export default ExplorePage;
