"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  Users,
  PlusCircle,
  Mail,
  ArrowRight,
  MapPin,
  Shield,
  ArrowUpRight,
  Trophy,
  Search,
} from "lucide-react";
import { TeamForListComponent, TeamRequestWithDetails, TeamWithPlayers } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Spinner, { DefaultLoader } from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { Carousel } from "@/components/carousel";
import { useAction } from "@/hooks/useAction";
import { acceptTeamRequest, declineTeamRequest } from "@/actions/invite-acions";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

function YourTeamsSection() {
  const { data: managedTeams, isLoading: isTeamLoading } = useQuery<TeamWithPlayers[]>({
    queryKey: ["managed-teams"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/teams/owned");
      return data.data;
    },
  });
  const { data: playerTeams, isLoading: isLoading } = useQuery<TeamWithPlayers[]>({
    queryKey: ["player-teams"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/teams/joined");
      return data.data;
    },
  });

  if (isTeamLoading || isLoading) {
    return (
      <div className="min-h flex items-center justify-center">
        <DefaultLoader className="primary-heading" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="h-60">
        <h3 className="my-2 ml-4 flex items-center gap-3 text-2xl font-black tracking-tighter uppercase italic">
          Managed <span className="primary-heading pr-2">By You</span>
        </h3>
        {/* Managed Teams */}
        {managedTeams && managedTeams.length > 0 ? (
          <div className="h-48">
            <Carousel>
              {managedTeams?.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="px-2">
            <EmptyCard type="managed" />
          </div>
        )}
      </div>

      <div className="h-60">
        <h3 className="mt-2 ml-4 flex items-center gap-3 text-2xl font-black tracking-tighter uppercase italic">
          Joined <span className="primary-heading pr-2">Squads</span>
        </h3>
        {/* Player Teams */}
        {playerTeams && playerTeams.length > 0 ? (
          <div className="h-48">
            <Carousel>
              {playerTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="px-2">
            <EmptyCard type="joined" />
          </div>
        )}
      </div>
    </div>
  );
}

interface TeamCardProps {
  team: TeamWithPlayers;
}

const TeamCard = ({ team }: TeamCardProps) => {
  if (!team) return null;

  const { name, abbreviation, logo, players } = team;

  return (
    <div className="group hover-card relative flex h-48 w-80 flex-shrink-0 flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-all duration-500">
      <div className="relative z-10 flex items-start justify-between">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 dark:border-white/10 dark:bg-slate-950">
            {logo ? (
              <img src={logo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <Trophy className="h-7 w-7 text-green-500/80 dark:text-green-400/80" />
              </div>
            )}
          </div>
          <div className="absolute -right-1.5 -bottom-1.5 rounded-xl bg-green-600 p-1.5 text-white shadow-xl dark:bg-green-500">
            <Shield className="h-3 w-3" />
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/teams/${team.abbreviation}`}
            className="group/btn flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/50 px-3 py-2 text-slate-500 shadow-sm transition-all duration-300 hover:bg-white hover:text-green-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-green-600 dark:hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-green-600 uppercase dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
            {abbreviation || "PRO"}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-tighter text-slate-500 uppercase dark:text-slate-400">
            <Users className="h-3.5 w-3.5" />
            {players.length || 0} Members
          </div>
        </div>

        <h3 className="font-inter dark:group-hover:text-green-40 truncate text-lg font-bold tracking-tight text-slate-900 uppercase transition-colors duration-300 group-hover:text-green-600 dark:text-white">
          {name || "Unnamed Team"}
        </h3>
      </div>
    </div>
  );
};
const CreateTeamCard = () => (
  <div className="group relative mt-12 h-48 overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-teal-900 p-6 text-white shadow-2xl">
    <h2 className="flex items-center text-2xl font-black tracking-tighter uppercase italic">
      <PlusCircle size={26} className="mr-3" />
      Build Your Legacy
    </h2>
    <p className="font-inter mb-6 text-sm font-medium text-green-100 opacity-80">
      Start your own legacy. Build a team from the ground up and recruit players.
    </p>
    <Link
      href={"/teams/create"}
      className="inline-block rounded-2xl bg-white px-6 py-3 font-[poppins] text-xs font-bold text-green-900 uppercase shadow-lg transition-colors hover:bg-green-50"
    >
      Create a team
    </Link>
  </div>
);

const EmptyCard = ({ type = "managed" }: { type: "managed" | "joined" }) => {
  const isManaged = type === "managed";

  const router = useRouter();

  return (
    <div className="animate-in hover-card fade-in slide-in-from-bottom-2 border-input flex min-h-48 w-full flex-col items-center justify-center rounded-3xl border bg-white/40 p-8 backdrop-blur-sm transition-all duration-700 dark:bg-slate-900/40">
      <div className="max-w-xs text-center">
        <h4 className="mb-1 text-lg font-bold text-slate-900 uppercase dark:text-white">
          {isManaged ? "No Squads Owned" : "No Joined Teams"}
        </h4>
        <p className="secondary-text font-[poppins] text-xs leading-relaxed font-normal">
          {isManaged
            ? "You haven't established a team legacy yet. Start your own organization today."
            : "You aren't currently signed to any rosters. Time to hit the recruitment portal."}
        </p>
      </div>

      <div className="mt-6">
        {isManaged ? (
          <Link
            href="/teams/create"
            className="flex items-center gap-2 rounded-xl bg-green-700 px-6 py-2 font-[poppins] text-[10px] font-bold text-white uppercase transition-all hover:scale-105 hover:bg-green-800 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" /> Create a Team
          </Link>
        ) : (
          <button
            onClick={() => {}}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2 font-[poppins] text-xs font-bold text-white uppercase shadow-lg transition-all hover:opacity-80 active:opacity-70 dark:bg-white dark:text-slate-900"
          >
            <Search className="h-4 w-4" /> Browse Open Spots
          </button>
        )}
      </div>
    </div>
  );
};

function Invitations() {
  const [inviteId, setInviteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: teamInvites, isLoading: isInviteLoading } = useQuery<TeamRequestWithDetails[]>({
    queryKey: ["team-invites"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/teams/invites");
      return data.data;
    },
  });

  const { execute: executeAccept, isLoading: isAccepting } = useAction(acceptTeamRequest, {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["team-invites"] });
      toast.success("Accepted!");
      setInviteId(null);
    },
    onError(error) {
      toast.error(error);
      setInviteId(null);
    },
  });

  const { execute: executeDecline, isLoading: isCanceling } = useAction(declineTeamRequest, {
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

  const handleAccept = (id: string, teamId: string, fromId: string) => {
    setInviteId(id);

    executeAccept({ teamId, reqId: id, fromId });
  };
  const handleDecline = (id: string, teamId: string) => {
    setInviteId(id);

    executeDecline({ id, teamId });
  };

  return (
    <div className="hide_scrollbar group relative mt-12 h-48 overflow-hidden overflow-x-hidden overflow-y-auto scroll-smooth rounded-3xl bg-gradient-to-br from-green-600 to-teal-900 p-6 text-white shadow-2xl">
      <h2 className="mb-4 flex items-center font-[cal_sans] text-xl text-gray-50 uppercase">
        <Mail size={22} className="mr-3" />
        Inbox
      </h2>

      {/* Team Invitations */}
      {isInviteLoading ? (
        <div className="center flex h-full w-full">
          <Spinner />
        </div>
      ) : !teamInvites || teamInvites.length === 0 ? (
        <NotFoundParagraph
          className="text-gray-200/80 dark:text-gray-200/80"
          description="No new invitations."
        />
      ) : (
        <div className="hover-card mb-4 rounded-xl">
          <ul className="space-y-3">
            {teamInvites.map((invite) => (
              <li key={invite.id} className="rounded-lg p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={invite?.team?.logo || "/team.svg"}
                      alt={invite.team.name}
                      className="h-8 w-8 rounded-full bg-white"
                      onError={(e) =>
                        (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
                      }
                    />
                    <span className="font-[poppins] font-semibold text-gray-100">
                      {invite.team.name}
                    </span>
                  </div>
                </div>
                {invite.status === "pending" && (
                  <div className="flex space-x-2 font-[poppins]">
                    <button
                      disabled={isAccepting || isCanceling}
                      onClick={() => handleAccept(invite.id, invite.teamId, invite.fromId)}
                      className="center flex flex-1 cursor-pointer rounded-md bg-green-100 py-1.5 text-sm font-semibold text-green-700 transition hover:bg-green-200"
                    >
                      {isAccepting && inviteId === invite.id ? <Spinner /> : "Accept"}
                    </button>
                    <button
                      onClick={() => handleDecline(invite.id, invite.teamId)}
                      disabled={isCanceling || isAccepting}
                      className="center flex flex-1 cursor-pointer rounded-md bg-red-100 py-1.5 text-sm font-semibold transition hover:bg-red-200"
                    >
                      {isCanceling && inviteId === invite.id ? (
                        <Spinner className="" />
                      ) : (
                        <span className="text-red-600">Decline</span>
                      )}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const TeamsPage = () => {
  return (
    <div className="mx-auto mt-4">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="font-[poppins] text-4xl font-extrabold">
          <span className="bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent dark:from-green-500 dark:to-emerald-400">
            Teams
          </span>
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="container-bg grid grid-cols-1 gap-6 rounded-xl py-4 lg:grid-cols-3 lg:gap-1">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2 lg:h-[32rem]">
          <YourTeamsSection />
        </div>

        {/* Sidebar Column */}
        <div className="grid grid-rows-2 justify-between gap-6 pr-4 lg:col-span-1 lg:h-[32rem] lg:gap-0">
          <Invitations />
          <CreateTeamCard />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
