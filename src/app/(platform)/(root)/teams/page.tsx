"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Users, PlusCircle, Mail, ArrowRight, MapPin } from "lucide-react";
import { User } from "@/generated/prisma";
import { TeamForListComponent, TeamRequestWithDetails } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DefaultLoader } from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { ActionButton } from "@/components/ActionButton";
import { Carousel } from "@/components/carousel";
import { useAction } from "@/hooks/useAction";
import { acceptTeamRequest, declineTeamRequest } from "@/actions/invite-acions";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";

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
    <div className="p-6">
      <h2 className="primary-text mb-5 flex items-center font-[cal_sans] text-2xl">
        <Users size={24} className="mr-3 text-green-600" />
        Your Teams
      </h2>

      {/* Managed Teams */}
      {managedTeams.length > 0 && (
        <div className="mb-6">
          <h3 className="secondary-text mb-3 font-[poppins] text-lg font-semibold">
            Managed by You
          </h3>
          <Carousel>
            {managedTeams.map((team) => (
              <ViewTeamCard key={team.id} team={team} />
            ))}
          </Carousel>
        </div>
      )}

      {/* Player Teams */}
      {playerTeams.length > 0 && (
        <div>
          <h3 className="secondary-text mb-3 font-[poppins] text-lg font-semibold">All Teams</h3>
          <Carousel>
            {playerTeams.map((team) => (
              <ViewTeamCard key={team.id} team={team} />
            ))}
          </Carousel>
        </div>
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
      <ActionButton
        href="/teams/create"
        title="Create"
        className="w-full rounded-lg bg-green-100 px-4 py-2 text-center font-[urbanist] font-bold shadow ring-0 transition hover:shadow-md dark:bg-gray-200 dark:hover:opacity-80"
        spanClasses="text-gray-800 dark:text-gray-800"
      />
    </div>
  );
}

interface InvitationsWidgetProps {
  teamInvites: TeamRequestWithDetails[];
}

function Invitations({ teamInvites }: InvitationsWidgetProps) {
  const [inviteId, setInviteId] = useState<string | null>(null);
  const { execute: executeAccept, isLoading: isAccepting } = useAction(acceptTeamRequest, {
    onSuccess(data) {
      toast.success("Accepted!");
      setInviteId(null);
      console.log(data);
    },
    onError(error) {
      toast.error(error);
      setInviteId(null);
    },
  });
  const { execute: executeDecline, isLoading: isCanceling } = useAction(declineTeamRequest, {
    onSuccess(data) {
      toast.success("Accepted!");
      setInviteId(null);
      console.log(data);
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
  const handleDecline = (id: string, teamId: string, fromId?: string) => {
    executeDecline({ id, teamId });
  };

  return (
    <div className="hide_scrollbar h-[22rem] overflow-x-hidden overflow-y-auto scroll-smooth rounded-lg bg-gradient-to-br from-green-600 to-emerald-800 p-6 shadow-lg">
      <h2 className="mb-4 flex items-center font-[cal_sans] text-xl text-gray-50">
        <Mail size={22} className="mr-3" />
        Team Invitations
      </h2>

      {/* Team Invitations */}
      {teamInvites.length === 0 ? (
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
                      disabled={isAccepting && inviteId === invite.id}
                      onClick={() => handleAccept(invite.id, invite.teamId, invite.fromId)}
                      className="flex-1 cursor-pointer rounded-md bg-green-100 py-1.5 text-sm font-semibold text-green-700 transition hover:bg-green-200"
                    >
                      {isAccepting ? <SyncLoader /> : "Accept"}
                    </button>
                    <button
                      onClick={() => handleDecline(invite.id, invite.teamId, invite.fromId)}
                      disabled={isCanceling}
                      className="flex-1 cursor-pointer rounded-md bg-red-100 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                    >
                      {isCanceling ? <SyncLoader /> : "Decline"}
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

interface TeamsDashboardProps {
  user: User;
  teamInvitations: TeamRequestWithDetails[];
  teamsAsOwner: TeamForListComponent[];
  teamsAsPlayer: TeamForListComponent[];
}

const TeamsPage = () => {
  const { data: dashboardData, isLoading: loading } = useQuery<TeamsDashboardProps>({
    queryKey: ["team-dashboard"],
    queryFn: async () => {
      const res = await axios.get("/api/teams/dashboard");
      return res.data;
    },
  });

  if (loading) {
    return (
      <div className="min-h flex items-center justify-center">
        <DefaultLoader className="primary-heading" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h flex items-center justify-center">
        <NotFoundParagraph description="Could not load dashboard data." />
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
      <div className="container-bg grid grid-cols-1 gap-6 rounded-xl p-4 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2">
          <YourTeamsSection
            teamsAsOwner={dashboardData.teamsAsOwner}
            teamsAsPlayer={dashboardData.teamsAsPlayer}
          />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6 lg:col-span-1">
          <CreateTeamCard />
          <Invitations teamInvites={dashboardData.teamInvitations} />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
