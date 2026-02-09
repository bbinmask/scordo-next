"use client";

import React, { useState } from "react";
import { ArrowUpRight, MapPin, PlusCircle, Calendar, Sword, Bell } from "lucide-react";
import Link from "next/link";
import { Match } from "@/generated/prisma";
import { formatDate } from "@/utils/helper/formatDate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Carousel } from "@/components/carousel";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
import { MatchWithDetails } from "@/lib/types";
import { acceptMatchRequest, declineMatchRequest } from "@/actions/match-actions";

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

const EmptyState = ({ type = "managed" }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 flex min-h-[16rem] w-full flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/40 p-8 backdrop-blur-sm transition-all duration-700 dark:border-white/10 dark:bg-slate-900/40">
    <div className="relative mb-4">
      <div className="animate-bounce rounded-3xl bg-slate-100 p-4 text-slate-400 duration-[3000ms] dark:bg-slate-800 dark:text-slate-600">
        <Sword className="h-10 w-10" />
      </div>
    </div>
    <div className="mb-6 max-w-xs text-center">
      <h4 className="mb-1 text-lg font-black tracking-tighter text-slate-900 uppercase dark:text-white">
        {type === "managed" ? "No Active Contracts" : "No Matches Scheduled"}
      </h4>
      <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
        {type === "managed"
          ? "You aren't currently overseeing any professional fixtures."
          : "The pitch is empty. Explore tournaments to join your next match."}
      </p>
    </div>
    <Link
      href="/matches/create"
      className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-green-500/20 transition-all hover:scale-105 hover:bg-green-700 active:scale-95"
    >
      <PlusCircle className="h-3 w-3" /> Initialize Match
    </Link>
  </div>
);

function MatchRequests() {
  const [inviteId, setInviteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: matchRequests, isLoading } = useQuery<MatchWithDetails[]>({
    queryKey: ["match-requests"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/matches/requests");

      return data.data;
    },
  });

  const { execute: executeAccept, isLoading: isAccepting } = useAction(acceptMatchRequest, {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["match-requests"] });
      toast.success("Accepted!");
      setInviteId(null);
    },
    onError(error) {
      toast.error(error);
      setInviteId(null);
    },
  });

  const { execute: executeDecline, isLoading: isCanceling } = useAction(declineMatchRequest, {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["team-invites"] });
      toast.success("Request Declined!");
      setInviteId(null);
    },
    onError(error) {
      toast.error(error);
      setInviteId(null);
    },
  });

  const handleAccept = (id: string) => {
    setInviteId(id);

    executeAccept({ id });
  };
  const handleDecline = (id: string) => {
    setInviteId(id);

    executeDecline({ id });
  };

  return (
    <div className="group hover-card border-input relative h-52 w-full rounded-3xl border p-6 font-[urbanist] font-semibold lg:mt-16">
      <div className="flex items-center justify-between">
        <h2 className="primary-text flex items-center gap-3 font-[inter] text-lg font-bold uppercase italic">
          <div className="relative">
            <Bell size={20} className="text-green-600" />
            {matchRequests?.length ? (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-slate-900" />
            ) : null}
          </div>
          Inbox
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/5">
          {matchRequests?.length} NEW
        </span>
      </div>

      {/* Team Invitations */}
      <div className="max-h-36 overflow-x-hidden overflow-y-auto">
        {isLoading ? (
          <div className="center flex h-full w-full">
            <Spinner />
          </div>
        ) : !matchRequests || matchRequests.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
            <p className="text-[10px] font-normal tracking-widest text-slate-400 uppercase">
              No Requests found!
            </p>
          </div>
        ) : (
          <ul className="hide_scrollbar mb-4 overflow-y-auto scroll-smooth rounded-xl">
            {matchRequests.map((req) => (
              <li key={req.id} className="rounded-lg px-3 py-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={req?.teamA?.logo || "/team.svg"}
                      alt={req.teamA.name}
                      className="h-8 w-8 rounded-full bg-white"
                      onError={(e) =>
                        (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
                      }
                    />
                    <h3 className="font-[urbanist] font-bold text-slate-800 dark:text-slate-100">
                      {req.teamA.name}
                    </h3>
                  </div>
                </div>
                {
                  <div className="flex space-x-2 font-[poppins]">
                    <button
                      disabled={isAccepting || isCanceling}
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 rounded-xl bg-green-600 py-2 text-[10px] font-bold text-white uppercase transition-opacity hover:opacity-90"
                    >
                      {isAccepting && inviteId === req.id ? (
                        <Spinner className="mx-auto h-4" />
                      ) : (
                        "Accept"
                      )}
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      disabled={isCanceling || isAccepting}
                      className="center flex flex-1 rounded-xl bg-slate-200 py-2 text-[10px] font-bold text-slate-600 uppercase transition-colors hover:bg-slate-300 dark:bg-white/10 dark:text-slate-400"
                    >
                      {isCanceling && inviteId === req.id ? (
                        <Spinner className="mx-auto h-4" />
                      ) : (
                        <span className="text-red-600 dark:text-red-300">Decline</span>
                      )}
                    </button>
                  </div>
                }
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

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
                  <EmptyState type="managed" />
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
                  <EmptyState type="joined" />
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
