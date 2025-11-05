"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  User,
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
import { Role, Team } from "@/generated/prisma";
import { FriendshipWithBoth, TeamRequestWithDetails } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";

const TeamType = {
  local: "local",
  club: "club",
  college: "college",
  corporate: "corporate",
  others: "others",
};

const RequestStatus = {
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
};

const FriendshipStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  BLOCKED: "BLOCKED",
};

const mockCurrentUser = {
  id: "user_owner_1",
  name: "Ravi Sharma",
  username: "ravi_sharma",
  avatar: "https://placehold.co/100x100/EBF4FF/4A90E2?text=RS",
  role: Role.admin,
};

const mockTeamsAsOwner = [
  {
    id: "team_1",
    name: "Mumbai Rockets",
    logo: "https://placehold.co/150x150/EBF4FF/4A90E2?text=MR",
    abbreviation: "MR",
    type: TeamType.club,
    role: "Owner",
  },
];

const mockTeamsAsPlayer = [
  {
    id: "team_pune",
    name: "Pune Pythons",
    logo: "https://placehold.co/150x150/E6FFFA/38B2AC?text=PP",
    abbreviation: "PP",
    type: TeamType.corporate,
    role: "Player", // Added for card context
  },
];

// Invitations for the user to join *other* teams
const mockTeamInvitations = [
  {
    id: "req_invite_1",
    status: RequestStatus.pending,
    team: {
      id: "team_bangalore",
      name: "Bangalore Blasters",
      logo: "https://placehold.co/100x100/FFF5E6/F6AD55?text=BB",
    },
  },
];

// Friend requests for the user
const mockFriendRequests = [
  {
    id: "friend_req_1",
    status: FriendshipStatus.PENDING,
    requester: {
      id: "user_friend_1",
      name: "Aisha Khan",
      avatar: "https://placehold.co/100x100/F0E6FF/9F7AEA?text=AK",
    },
  },
];

const mockDashboardData = {
  user: mockCurrentUser,
  teamsAsOwner: mockTeamsAsOwner,
  teamsAsPlayer: mockTeamsAsPlayer,
  teamInvitations: mockTeamInvitations,
  friendRequests: mockFriendRequests,
};

function TeamCard({ team, role }: { team: Team; role: Role }) {
  const roleColors = {
    Owner: "bg-blue-100 text-blue-800",
    Captain: "bg-green-100 text-green-800",
    Player: " text-gray-800",
  };

  const handleViewTeam = () => {
    // In a real app, this would use a router:
    // navigate(`/teams/${team.id}`);
    alert(`Navigating to ${team.name}'s page...`);
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center space-x-4 p-5">
        <img
          src={team?.logo || undefined}
          alt={`${team.name} logo`}
          className="h-20 w-20 rounded-full border-2 border-gray-100"
          onError={(e) =>
            (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
          }
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
          <p className="text-sm text-gray-500">@{team.abbreviation}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 pb-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColors[role] || roleColors.Player}`}
        >
          {role}
        </span>
        <button
          onClick={handleViewTeam}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          View Team
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
}

function YourTeamsSection({
  teamsAsOwner,
  teamsAsPlayer,
}: {
  teamsAsOwner: Team[];
  teamsAsPlayer: Team[];
}) {
  const managedTeams = [...teamsAsOwner];
  const playerTeams = [...teamsAsPlayer];

  return (
    <div className="rounded-lg p-6 shadow-lg">
      <h2 className="mb-5 flex items-center text-2xl font-bold text-gray-800">
        <Users size={24} className="mr-3 text-blue-600" />
        Your Teams
      </h2>

      {/* Managed Teams */}
      {managedTeams.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Managed by You</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {managedTeams.map((team) => (
              <TeamCard key={team.id} team={team} role={team.role} />
            ))}
          </div>
        </div>
      )}

      {/* Player Teams */}
      {playerTeams.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Your Player Hub</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {playerTeams.map((team) => (
              <TeamCard key={team.id} team={team} role={team.role} />
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
  const handleCreateTeam = () => {
    // In a real app, this would navigate to a /teams/new page or open a modal
    alert("Navigating to Create Team page...");
  };

  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg">
      <h2 className="mb-3 flex items-center text-xl font-bold">
        <PlusCircle size={22} className="mr-2" />
        Create a New Team
      </h2>
      <p className="mb-4 text-sm text-blue-100">
        Start your own legacy. Build a team from the ground up and recruit players.
      </p>
      <button
        onClick={handleCreateTeam}
        className="hover: w-full rounded-lg px-4 py-2 font-bold text-blue-700 shadow transition"
      >
        Get Started
      </button>
    </div>
  );
}

interface InvitationsWidgetProps {
  teamInvites: TeamRequestWithDetails[];
  friendRequests: FriendshipWithBoth[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onAcceptFriend: (id: string) => void;
  onDeclineFriend: (id: string) => void;
}

function InvitationsWidget({
  teamInvites,
  friendRequests,
  onAccept,
  onDecline,
  onAcceptFriend,
  onDeclineFriend,
}: InvitationsWidgetProps) {
  return (
    <div className="rounded-lg p-6 shadow-lg">
      <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800">
        <Mail size={22} className="mr-3 text-red-600" />
        Your Invitations
      </h2>

      {/* Team Invitations */}
      {teamInvites.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 font-[cal_sans] text-sm text-gray-500 uppercase">Team Invites</h3>
          <ul className="space-y-3">
            {teamInvites.map((invite) => (
              <li key={invite.id} className="rounded-lg p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={invite?.team?.logo || undefined}
                      alt={invite.team.name}
                      className="h-8 w-8 rounded-full"
                      onError={(e) =>
                        (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
                      }
                    />
                    <span className="font-[poppins] font-semibold text-gray-800">
                      {invite.team.name}
                    </span>
                  </div>
                </div>
                {invite.status === RequestStatus.pending && (
                  <div className="flex space-x-2 font-[poppins]">
                    <button
                      onClick={() => onAccept(invite.id)}
                      className="flex-1 rounded-md bg-green-100 py-1.5 text-sm text-green-700 transition hover:bg-green-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onDecline(invite.id)}
                      className="flex-1 rounded-md bg-red-100 py-1.5 text-sm text-red-700 transition hover:bg-red-200"
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

      {/* Friend Requests */}

      {teamInvites.length === 0 && <NotFoundParagraph description="No new invitations." />}
    </div>
  );
}

interface TeamsDashboardProps {}

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
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <NotFoundParagraph description="Could not load dashboard data." />
      </div>
    );
  }

  return (
    <div className="font-inter min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teams Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {dashboardData.user.name}!</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
            <InvitationsWidget
              teamInvites={dashboardData.teamInvitations}
              friendRequests={dashboardData.friendRequests}
              onAccept={handleAcceptInvite}
              onDecline={handleDeclineInvite}
              onAcceptFriend={handleAcceptFriend}
              onDeclineFriend={handleDeclineFriend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
