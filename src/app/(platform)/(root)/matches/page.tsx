"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Carousel } from "@/components/carousel";
import Spinner from "@/components/Spinner";
import { EmptyCard } from "./_components/cards/EmptyCard";
import { MatchRequests } from "./_components/MatchRequests";
import { MatchCard } from "./_components/cards/MatchCard";
import { CreateMatchCard } from "./_components/cards/CreateMatchCard";
import { MatchWithDetails } from "@/lib/types";
import { Crown, Sword } from "lucide-react";
const MatchesPage = () => {
  const { data: matchesAsOfficial, isLoading: officialsLoading } = useQuery<MatchWithDetails[]>({
    queryKey: ["matches-as-official"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/matches/officials");

      if (!data.success) return [];

      return data.data;
    },
  });
  const { data: matches, isLoading } = useQuery<MatchWithDetails[]>({
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
    <div className="mt-4 grid grid-cols-1 gap-10 px-4 pb-20 lg:grid-cols-12">
      {/* Main Matches Column (8 Span) */}
      <div className="container-bg rounded-3xl border border-slate-100 lg:col-span-8 dark:border-white/5">
        {/* Section: Team Matches */}
        <div className="relative overflow-hidden py-6">
          <section className="relative z-10">
            <div className="mb-6 flex items-center justify-between px-4">
              <h3 className="flex items-center gap-3 text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                Team <span className={"primary-heading pr-2"}>Matches</span>
              </h3>
              <div className="mx-6 h-px flex-1 bg-slate-100 dark:bg-white/5" />
            </div>

            {isLoading ? (
              <div className="flex h-52 items-center justify-center">
                <Spinner className="" />
              </div>
            ) : matches && matches.length > 0 ? (
              <Carousel>
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </Carousel>
            ) : (
              <div className="px-6">
                <EmptyCard
                  Icon={<Sword size={24} />}
                  type="matches"
                  title="No match found"
                  linkText="Create Match"
                  href="/matches/create"
                  description="The pitch is empty. Explore tournaments to join your next match."
                />
              </div>
            )}
          </section>
        </div>

        {/* Matches as Official */}
        <div className="relative overflow-hidden py-6">
          <section className="relative z-10">
            <div className="mb-6 flex items-center justify-between px-4">
              <h3 className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                Matches As <span className={"primary-heading pr-2"}>Official</span>
              </h3>
              <div className="mx-6 h-px flex-1 bg-slate-100 dark:bg-white/5" />
            </div>

            {officialsLoading ? (
              <div className="flex h-52 items-center justify-center">
                <Spinner className="" />
              </div>
            ) : matchesAsOfficial && matchesAsOfficial.length > 0 ? (
              <Carousel>
                {matchesAsOfficial.map((match, i) => (
                  <MatchCard key={match.id + i} match={match} />
                ))}
              </Carousel>
            ) : (
              <div className="px-6">
                <EmptyCard
                  Icon={<Crown size={24} />}
                  type="matches"
                  title="No matches found"
                  linkText="Create Match"
                  href="/matches/create"
                  description="You are not currently scheduled for any matches. Create a new match or join an existing one."
                />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Sidebar Column (4 Span) */}
      <aside className="flex gap-6 lg:col-span-4 lg:flex-col">
        <MatchRequests />
        <CreateMatchCard />
      </aside>
    </div>
  );
};

export default MatchesPage;
