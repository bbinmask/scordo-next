"use client";

import React, { useState } from "react";
import { ArrowUpRight, MapPin, PlusCircle, Calendar, Bell } from "lucide-react";
import Link from "next/link";
import { Match } from "@/generated/prisma";
import { formatDate } from "@/utils/helper/formatDate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Carousel } from "@/components/carousel";
import Spinner from "@/components/Spinner";
import { EmptyCard } from "./_components/cards/EmptyCard";
import { MatchRequests } from "./_components/MatchRequests";
const MatchCard = ({ match }: { match: any }) => {
  if (!match) return null;

  return (
    <div className="group relative h-56 w-80 flex-shrink-0 p-1">
      <div className="hover-card relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[2rem] p-6">
        {/* Visual Versus Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex -space-x-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-50 bg-white shadow-lg dark:border-[#020617] dark:bg-slate-800">
              <img src={match.teamA.logo} className="h-full w-full object-cover" alt="Team A" />
            </div>
            <div className="z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-50 bg-white shadow-lg dark:border-[#020617] dark:bg-slate-800">
              <img src={match.teamB.logo} className="h-full w-full object-cover" alt="Team B" />
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/matches/${match.id}`}
              className="rounded-xl bg-slate-100 p-2.5 text-slate-400 transition-all hover:text-green-500 dark:bg-white/5"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-green-100 bg-green-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-green-600 uppercase dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
              {match.category.toUpperCase()}
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              • {match.overs} Overs
            </span>
          </div>
          <h3 className="truncate font-[poppins] text-lg font-black tracking-tight text-slate-900 uppercase transition-colors group-hover:text-green-500 dark:text-white">
            {match.teamA.abbreviation}{" "}
            <span className="font-inter mx-1 text-green-800 dark:text-green-700">vs</span>{" "}
            {match.teamB.abbreviation}
          </h3>
          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <MapPin className="h-3 w-3" /> {match.location}
          </p>
        </div>

        {/* Footer Status */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
          {match?.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">
                {formatDate(new Date(match.date))}
              </span>
            </div>
          )}
          <span className="inline-flex animate-pulse items-center gap-1 text-[9px] font-black text-green-500 uppercase italic">
            {match.status === "in_progress" ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-red-500">Live Feed</span>
              </>
            ) : (
              "Not Started"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const CreateMatchCard = () => (
  <div className="group relative h-52 overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-teal-900 p-6 text-white shadow-2xl">
    <div className="flex items-center">
      <PlusCircle size={26} className="mr-3" />
      <h2 className="flex items-center text-2xl font-black tracking-tighter uppercase italic">
        Initiate Fixture
      </h2>
    </div>
    <p className="font-inter mb-6 pl-10 text-sm font-medium text-green-100 opacity-80">
      Assign teams, set custom rules, and deploy professional officials for your next championship
      match.
    </p>
    <Link
      href={"/matches/create"}
      className="ml-10 inline-block rounded-2xl bg-white px-6 py-3 font-[poppins] text-xs font-bold text-green-900 uppercase shadow-lg hover:bg-green-50"
    >
      Create a match
    </Link>
  </div>
);

const MatchesPage = () => {
  const { data: matchesAsOfficial, isLoading: officialsLoading } = useQuery<Match[]>({
    queryKey: ["matches-as-official"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/matches/officials");

      if (!data.success) return [];

      return data.data;
    },
  });
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/matches/");

      if (!data.success) {
        return [];
      }

      return data.data;
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-32 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
      <div className="max-w-7xl pt-12">
        <div className="mb-12 flex items-center justify-between px-4">
          <h1 className="primary-text font-[inter] text-3xl font-black tracking-tighter uppercase italic">
            Matches <span className="primary-heading pr-2">Dashboard</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Matches Column */}
          <div className="space-y-12 lg:col-span-8">
            <section>
              <div className="mb-6 flex items-center justify-between px-4">
                <h3 className="flex items-center gap-3 font-[inter] text-2xl font-black uppercase italic">
                  Team <span className="primary-heading pr-2">Matches</span>
                </h3>
                <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
              </div>

              {isLoading ? (
                <div className="center flex w-full">
                  <Spinner />
                </div>
              ) : matches && matches.length > 0 ? (
                <Carousel>
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </Carousel>
              ) : (
                <div className="px-4">
                  <EmptyCard type="managed" />
                </div>
              )}
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between px-4">
                <h3 className="flex items-center gap-2 font-[inter] text-2xl font-black tracking-tighter uppercase italic">
                  Matches As <span className="primary-heading pr-2">Official</span>
                </h3>
                <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
              </div>

              {officialsLoading ? (
                <div className="center flex w-full">
                  <Spinner />
                </div>
              ) : matchesAsOfficial && matchesAsOfficial.length > 0 ? (
                <div className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth pb-6">
                  {matchesAsOfficial.map((match, i) => (
                    <MatchCard key={i} match={match} />
                  ))}
                </div>
              ) : (
                <div className="px-4">
                  <EmptyCard type="joined" />
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column */}
          <aside className="gap-2 space-y-8 px-4 sm:flex lg:col-span-4 lg:block lg:px-0 lg:pr-2">
            {/* Create Match */}
            <CreateMatchCard />

            {/* Match Requests */}
            <MatchRequests />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
