"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  PlusCircle,
  Shield,
  Bell,
  LayoutGrid,
  Loader2,
  Crown,
  Activity,
  Search,
} from "lucide-react";
import { TeamRequestWithDetails, TeamWithPlayers } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { Carousel } from "@/components/carousel";
import { useAction } from "@/hooks/useAction";
import { acceptTeamRequest, declineTeamRequest } from "@/actions/invite-acions";
import { toast } from "sonner";
import { EmptyState } from "@/components/cards/EmptyState";
import TeamCard from "./_components/TeamCard";
import { SectionHeader } from "@/components/layouts/SectionHeader";

const CreateTeamCard = () => (
  <div className="group relative h-52 overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-teal-900 p-6 text-white shadow-2xl">
    <div className="flex items-center">
      <PlusCircle size={28} className="mr-3" />
      <h2 className="flex items-center text-2xl font-black tracking-tighter uppercase italic">
        Build Your Legacy
      </h2>
    </div>
    <p className="font-inter mb-6 pl-10 text-sm font-medium text-green-100 opacity-80">
      Start your own legacy. Build a team from the ground up and recruit players.
    </p>
    <Link
      href={"/teams/create"}
      className="ml-10 inline-block rounded-2xl bg-white px-6 py-3 font-[poppins] text-xs font-bold text-green-900 uppercase shadow-lg hover:bg-green-50"
    >
      Create a team
    </Link>
  </div>
);

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

  const handleAccept = (id: string, teamId: string, toId: string) => {
    setInviteId(id);

    executeAccept({ teamId, reqId: id, toId });
  };
  const handleDecline = (id: string, teamId: string) => {
    setInviteId(id);

    executeDecline({ id, teamId });
  };

  return (
    <div className="group hover-card border-input relative h-52 w-full rounded-3xl border p-6 font-[urbanist] font-semibold lg:h-[400px]">
      <div className="flex items-center justify-between">
        <h2 className="primary-text flex items-center gap-3 font-[poppins] text-lg font-black tracking-tighter uppercase italic">
          <div className="relative">
            <Bell size={20} className="text-green-600" />
          </div>
          Inbox
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/5">
          {teamInvites?.length} NEW
        </span>
      </div>

      {/* Team Invitations */}
      {isInviteLoading ? (
        <div className="center flex h-full w-full">
          <Spinner />
        </div>
      ) : !teamInvites || teamInvites.length === 0 ? (
        <NotFoundParagraph
          className="font-[urbanist] text-sm font-semibold"
          description="No new invitations."
        />
      ) : (
        <ul className="hide_scrollbar mb-4 max-h-36 overflow-y-auto scroll-smooth rounded-xl">
          {teamInvites.map((invite) => (
            <li key={invite.id} className="rounded-lg px-3 py-2">
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
                  <h3 className="font-[urbanist] font-bold text-slate-800 dark:text-slate-100">
                    {invite.team.name}
                  </h3>
                </div>
              </div>
              {invite.status === "pending" && (
                <div className="flex space-x-2 font-[poppins]">
                  <button
                    disabled={isAccepting || isCanceling}
                    onClick={() => handleAccept(invite.id, invite.teamId, invite.toId)}
                    className="flex-1 rounded-xl bg-green-600 py-2 text-[10px] font-bold text-white uppercase transition-opacity hover:opacity-90"
                  >
                    {isAccepting && inviteId === invite.id ? (
                      <Spinner className="mx-auto h-4" />
                    ) : (
                      "Accept"
                    )}
                  </button>
                  <button
                    onClick={() => handleDecline(invite.id, invite.teamId)}
                    disabled={isCanceling || isAccepting}
                    className="center flex flex-1 rounded-xl bg-slate-200 py-2 text-[10px] font-bold text-slate-600 uppercase transition-colors hover:bg-slate-300 dark:bg-white/10 dark:text-slate-400"
                  >
                    {isCanceling && inviteId === invite.id ? (
                      <Spinner className="mx-auto h-4" />
                    ) : (
                      <span className="text-red-600 dark:text-red-300">Decline</span>
                    )}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const TeamsPage = () => {
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

  return (
    <div className="mx-auto mt-4 px-4 pb-20">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* MAIN COLUMN (2 Span) */}
        <div className="container-bg relative space-y-12 overflow-hidden rounded-3xl border border-slate-100 py-6 shadow-sm lg:col-span-2 dark:border-white/5">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <LayoutGrid size={200} />
          </div>

          {isLoading || isTeamLoading ? (
            <div className="flex h-full items-center justify-center py-40">
              <Loader2 size={48} className="animate-spin text-emerald-50" />
            </div>
          ) : (
            <div className="relative z-10 space-y-16">
              {/* Section: Managed Teams */}
              <>
                <SectionHeader title="Managed" highlight="By You" />

                {managedTeams && managedTeams.length > 0 ? (
                  <Carousel>
                    {managedTeams.map((team) => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </Carousel>
                ) : (
                  <div className="px-6">
                    <EmptyState
                      action={{
                        label: "Create a Squad",
                        href: "/teams/create",
                      }}
                      title="No Squads Owned"
                      description="You haven't established a team legacy yet. Start your own organization today."
                      icon={<Shield size={20} />}
                    />
                  </div>
                )}
              </>

              {/* Section: Joined Teams */}
              <>
                <SectionHeader title="Joined" highlight="Squads" />

                {playerTeams && playerTeams.length > 0 ? (
                  <Carousel>
                    {playerTeams.map((team) => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </Carousel>
                ) : (
                  <div className="px-6">
                    <EmptyState
                      action={{
                        label: "Explore Squads",
                        href: "/explore",
                      }}
                      title="No Squads"
                      description="You aren't currently signed to any rosters. Time to hit the recruitment portal."
                      icon={<Search size={20} />}
                    />
                  </div>
                )}
              </>
            </div>
          )}
        </div>

        {/* SIDEBAR COLUMN (1 Span) */}
        <div className="flex gap-6 lg:flex-col">
          <Invitations />
          <CreateTeamCard />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
