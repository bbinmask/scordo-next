"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  PlusCircle,
  Search,
  Mail,
  Check,
  X,
  ArrowRight,
  UserPlus,
  MapPin,
  Trophy,
} from "lucide-react";
import { Role, Team, User } from "@/generated/prisma";
import { FriendshipWithBoth, TeamForListComponent, TeamRequestWithDetails } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DefaultLoader } from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { ActionButton } from "@/components/ActionButton";
import { ViewTeamCard } from "../_components/ViewTeamCard";

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {managedTeams.map((team) => (
              <ViewTeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {/* Player Teams */}
      {playerTeams.length > 0 && (
        <div>
          <h3 className="secondary-text mb-3 font-[poppins] text-lg font-semibold">All Teams</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {playerTeams.map((team) => (
              <ViewTeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {managedTeams.length === 0 && playerTeams.length === 0 && (
        <p className="text-gray-500">You are not a member of any teams yet.</p>
      )}
    </div>
  );
}

function CreateTeamCard() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-green-600 to-teal-800 p-6 text-white shadow-lg">
      <h2 className="mb-2 flex items-center font-[cal_sans] text-xl font-bold text-gray-50">
        <PlusCircle size={22} className="mr-2" />
        Create a New Team
      </h2>
      <p className="mb-4 font-[urbanist] text-sm font-medium tracking-wide text-green-100">
        Start your own legacy. Build a team from the ground up and recruit players.
      </p>
      <ActionButton
        href="/teams/create"
        title="Create"
        className="w-full rounded-lg bg-green-100 px-4 py-2 text-center font-[urbanist] font-bold shadow ring-0 transition hover:shadow-md dark:bg-gray-200 dark:hover:bg-gray-200"
        spanClasses="text-gray-800 dark:text-gray-800"
      />
    </div>
  );
}

interface InvitationsWidgetProps {
  teamInvites: TeamRequestWithDetails[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function Invitations({ teamInvites, onAccept, onDecline }: InvitationsWidgetProps) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-green-600 to-emerald-800 p-6 shadow-lg">
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
                      className="h-8 w-8 rounded-full"
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
                      onClick={() => onAccept(invite.id)}
                      className="flex-1 cursor-pointer rounded-md bg-green-100 py-1.5 text-sm text-green-700 transition hover:bg-green-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onDecline(invite.id)}
                      className="flex-1 cursor-pointer rounded-md bg-red-100 py-1.5 text-sm text-red-700 transition hover:bg-red-200"
                    >
                      Decline
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

  // const loading = false;
  // const [dashboardData, setDashboardData] = useState(mockDashboardData);

  // --- Mock data fetching ---
  // useEffect(() => {
  //   // Simulate API call to get all dashboard data for the logged-in user
  //   setTimeout(() => {
  //     setDashboardData(mockDashboardData);
  //     setLoading(false);
  //   }, 500);
  // }, []);

  // --- Invitation Handlers (would call APIs) ---
  const handleAcceptInvite = (inviteId: string) => {
    console.log("Accepting team invite:", inviteId);
    alert("Team invitation accepted! (Simulation)");
    // setDashboardData((prev) => ({
    //   ...prev,
    //   teamInvitations: prev.teamInvitations.filter((inv) => inv.id !== inviteId),
    //   // In a real app, you'd also re-fetch or add to `teamsAsPlayer`
    // }));
  };

  const handleDeclineInvite = (inviteId: string) => {
    console.log("Declining team invite:", inviteId);
    alert("Team invitation declined. (Simulation)");
    // setDashboardData((prev) => ({
    //   ...prev,
    //   teamInvitations: prev.teamInvitations.filter((inv) => inv.id !== inviteId),
    // }));
  };

  const handleAcceptFriend = (reqId: string) => {
    console.log("Accepting friend request:", reqId);
    alert("Friend request accepted! (Simulation)");
    // setDashboardData((prev) => ({
    //   ...prev,
    //   friendRequests: prev.friendRequests.filter((req) => req.id !== reqId),
    // }));
  };

  const handleDeclineFriend = (reqId: string) => {
    console.log("Declining friend request:", reqId);
    alert("Friend request declined. (Simulation)");
    // setDashboardData((prev) => ({
    //   ...prev,
    //   friendRequests: prev.friendRequests.filter((req) => req.id !== reqId),
    // }));
  };

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
          <Invitations
            teamInvites={dashboardData.teamInvitations}
            onAccept={handleAcceptInvite}
            onDecline={handleDeclineInvite}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
