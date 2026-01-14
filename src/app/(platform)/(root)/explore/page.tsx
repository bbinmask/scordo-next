"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Users, Shield, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import AfterSearch from "./_components/AfterSearch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Carousel } from "@/components/carousel";

/* -------------------- Filters -------------------- */

const filters = [
  { label: "All", value: "all", icon: Search },
  { label: "Users", value: "users", icon: Users },
  { label: "Teams", value: "teams", icon: Shield },
  { label: "Tournaments", value: "tournaments", icon: Trophy },
] as const;

/* -------------------- Component -------------------- */

const ExplorePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("query") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<"all" | "users" | "teams" | "tournaments">(
    "all"
  );

  /* -------------------- Debounce (SAFE) -------------------- */

  const debouncedSetQuery = useRef(
    debounce((value: string) => {
      setQuery(value);
      router.replace(value ? `${pathname}?query=${encodeURIComponent(value)}` : pathname);
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSetQuery(e.target.value);
  };

  const clearSearch = () => {
    debouncedSetQuery.cancel();
    setQuery("");
    router.replace(pathname);
  };

  /* -------------------- Queries -------------------- */

  const usersQuery = useQuery({
    queryKey: ["search-users", query],
    queryFn: () => axios.get(`/api/search/users?query=${query}`).then((res) => res.data),
    enabled: query.trim().length > 0,
  });

  const teamsQuery = useQuery({
    queryKey: ["search-teams", query],
    queryFn: () => axios.get(`/api/search/teams?query=${query}`).then((res) => res.data),
    enabled: query.trim().length > 0,
  });

  const tournamentsQuery = useQuery({
    queryKey: ["search-tournaments", query],
    queryFn: () => axios.get(`/api/search/tournaments?query=${query}`).then((res) => res.data),
    enabled: query.trim().length > 0,
  });

  const results = {
    users: usersQuery.data ?? [],
    teams: teamsQuery.data ?? [],
    tournaments: tournamentsQuery.data ?? [],
  };

  const isLoading = usersQuery.isLoading || teamsQuery.isLoading || tournamentsQuery.isLoading;

  /* -------------------- Render -------------------- */

  return (
    <div className="min-h-full rounded-xl font-sans">
      {/* Search Bar */}
      <div className="relative mx-auto p-2">
        <div className="relative">
          <Input
            value={query}
            onChange={handleChange}
            placeholder="Search users, teams, tournaments..."
            className="rounded-full border border-gray-400 p-4 pr-12 text-base focus:ring-2 focus:ring-green-600"
          />
          <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500" />
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
          // activeFilter={activeFilter}
        />
      )}
    </div>
  );
};

export default ExplorePage;
