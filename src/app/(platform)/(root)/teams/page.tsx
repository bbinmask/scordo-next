"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Users, PlusCircle, Mail, ArrowRight, MapPin } from "lucide-react";
import { TeamForListComponent, TeamRequestWithDetails } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Spinner, { DefaultLoader } from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { ActionButton } from "@/components/ActionButton";
import { Carousel } from "@/components/carousel";
import { useAction } from "@/hooks/useAction";
import { acceptTeamRequest, declineTeamRequest } from "@/actions/invite-acions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function YourTeamsSection({
  teamsAsOwner,
  teamsAsPlayer,
}: {
  teamsAsOwner: TeamForListComponent[];
  teamsAsPlayer: TeamForListComponent[];
}) {
  const managedTeams = [...teamsAsOwner];
  const playerTeams = [...teamsAsPlayer];

  return (
    <div className="">
      {/* Managed Teams */}
      {managedTeams.length > 0 && (
        <>
          <h3 className="secondary-text p-6 font-[poppins] text-xl font-semibold">
            Managed by You
          </h3>
          <Carousel>
            {managedTeams.map((team) => (
              <ViewTeamCard key={team.id} team={team} />
            ))}
          </Carousel>
        </>
      )}

      {/* Player Teams */}
      {playerTeams.length > 0 && (
        <>
          <h3 className="secondary-text p-6 font-[poppins] text-xl font-semibold">All Teams</h3>
          <Carousel>
            {playerTeams.map((team) => (
              <ViewTeamCard key={team.id} team={team} />
            ))}
          </Carousel>
        </>
      )}

      {managedTeams.length === 0 && playerTeams.length === 0 && (
        <p className="text-gray-500">You are not a member of any teams yet.</p>
      )}
    </div>
  );
}

interface ViewTeamCardProps {
  team: TeamForListComponent;
}

export function ViewTeamCard({ team }: ViewTeamCardProps) {
  return (
    <Link
      href={`/teams/${team.abbreviation}`}
      className="group hover-card relative mb-1 grid w-60 flex-shrink-0 rounded-xl bg-white shadow-md dark:bg-gray-800"
    >
      {/* Card Content */}
      <div className="px-3 py-4">
        <div className="flex items-center space-x-2">
          {/* Team Logo */}
          <div className="flex-shrink-0">
            <img
              src={team?.logo || "/team.svg"}
              alt={`${team.name} logo`}
              className="border-input h-12 w-12 rounded-full border-2"
              onError={(e) =>
                (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
              }
            />
          </div>
          {/* Team Name */}
          <div className="min-w-0 flex-1">
            <h3
              title={team.name}
              className="primary-text truncate font-[cal_sans] text-[15px] font-bold tracking-wide"
            >
              {team.name}
            </h3>
            <p className="secondary-text font-[urbanist] text-sm tracking-wide">
              @{team.abbreviation}
            </p>
          </div>
        </div>

        {/* Team Info */}
        <div className="mt-3 space-y-1">
          {team.address && (
            <div className="secondary-text flex items-center font-[urbanist] text-xs font-semibold">
              <MapPin size={16} className="mr-2 text-green-600" />
              <span>
                {team?.address?.city} {team?.address?.state}
              </span>
            </div>
          )}
          {(team?._count?.players !== undefined || team?._count?.players !== null) && (
            <div className="secondary-text flex items-center font-[urbanist] text-xs font-semibold">
              <Users size={16} className="mr-2 text-green-600" />
              <span>{team?._count?.players} Players</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2 font-[poppins] text-sm font-medium text-green-600">
        <span>View Team</span>
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

function CreateTeamCard() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-green-600 to-teal-800 p-6 text-white shadow-lg">
      <h2 className="mb-2 flex items-center font-[cal_sans] text-xl text-gray-50">
        <PlusCircle size={22} className="mr-2" />
        Create a New Team
      </h2>
      <p className="mb-4 font-[urbanist] text-sm font-medium tracking-wide text-green-100">
        Start your own legacy. Build a team from the ground up and recruit players.
      </p>
      <Button asChild className="hover-card">
        <Link href={"/teams/create"} className="rounded-xl bg-gray-50 px-8 py-2">
          Create
        </Link>
      </Button>
    </div>
  );
}

interface InvitationsProps {}

function Invitations({}: InvitationsProps) {
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
    <div className="hide_scrollbar h-[22rem] overflow-x-hidden overflow-y-auto scroll-smooth rounded-lg bg-gradient-to-br from-green-600 to-emerald-800 p-6 shadow-lg">
      <h2 className="mb-4 flex items-center font-[cal_sans] text-xl text-gray-50">
        <Mail size={22} className="mr-3" />
        Team Invitations
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
        <div className="mb-4">
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
  const { data: teams, isLoading: isTeamLoading } = useQuery<TeamForListComponent[]>({
    queryKey: ["all-teams"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/teams/all");
      return data.data;
    },
  });

  if (isTeamLoading) {
    return (
      <div className="min-h flex items-center justify-center">
        <DefaultLoader className="primary-heading" />
      </div>
    );
  }

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
      <div className="container-bg grid grid-cols-1 gap-6 rounded-xl lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2">
          <YourTeamsSection teamsAsOwner={teams as any} teamsAsPlayer={teams as any} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6 lg:col-span-1">
          <CreateTeamCard />
          <Invitations />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
