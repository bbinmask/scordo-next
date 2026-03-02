"use client";

import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Users, Shield, Trophy, Swords } from "lucide-react";
import AfterSearch from "./_components/AfterSearch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("query") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "users" | "teams" | "tournaments" | "matches"
  >("all");

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        router.replace(value ? `${pathname}?query=${encodeURIComponent(value)}` : pathname);
      }, 500),
    [router, pathname]
  );
  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSetQuery(value);
  };

  const clearSearch = () => {
    debouncedSetQuery.cancel();
    setQuery("");
    router.replace(pathname);
  };

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

  const isLoading = usersQuery.isLoading || teamsQuery.isLoading || tournamentsQuery.isLoading;

  return (
    <div className="min-h-full rounded-xl font-sans">
      {/* Search Bar */}
      <div className="relative mx-auto">
        <div className="relative p-2">
          <input
            value={query}
            onChange={handleChange}
            placeholder="Search users, teams, tournaments..."
            className="w-full rounded-full border border-gray-400 px-4 py-2 pr-12 text-base focus:ring-2 focus:ring-green-600"
          />
          <Search className="absolute top-1/2 right-4 -translate-y-1/2 p-1 text-gray-500" />
        </div>

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
