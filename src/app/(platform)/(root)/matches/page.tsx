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
import { MatchCard } from "./_components/cards/MatchCard";
import { CreateMatchCard } from "./_components/cards/CreateMatchCard";
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
