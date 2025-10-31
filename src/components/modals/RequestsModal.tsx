"use client";

import { TeamRequest, TournamentRequest } from "@/generated/prisma";
import { FriendshipWithBoth } from "@/lib/types";
import {
  Check,
  Inbox,
  Shield,
  Trophy,
  UserPlus,
  X,
  ChevronLeft,
  ChevronUp,
  ShieldPlus,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useNotificationModal } from "@/hooks/store/use-profile-notifications";
import NotFoundParagraph from "../NotFoundParagraph";
import { capitalize } from "lodash";

interface RequestsModalProps {
  initialRequests: {
    friendRequests: FriendshipWithBoth[];
    tournamentRequests: TournamentRequest[];
    teamRequests: TeamRequest[];
  };
}

export const initialRequests = {
  friendRequests: [
    {
      id: "fr1",
      status: "PENDING",
      requesterId: "u201",
      addresseeId: "u202",
      requester: {
        id: "u201",
        clerkId: "clerk_u201",
        name: "Amit Sharma",
        username: "amitsharma",
        email: "amit@example.com",
        gender: "male",
        role: "player",
        dob: new Date("1999-04-12"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/men/31.jpg",
        isVerified: true,
        bio: "Opening batsman from Delhi.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      addressee: {
        id: "u202",
        clerkId: "clerk_u202",
        name: "Rahul Verma",
        username: "rahulv",
        email: "rahul@example.com",
        gender: "male",
        role: "fan",
        dob: new Date("2000-08-10"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/men/10.jpg",
        isVerified: false,
        bio: "Big fan of local cricket leagues.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "fr2",
      status: "PENDING",
      requesterId: "u203",
      addresseeId: "u204",
      requester: {
        id: "u203",
        clerkId: "clerk_u203",
        name: "Neha Kapoor",
        username: "nehakapoor",
        email: "neha@example.com",
        gender: "female",
        role: "fan",
        dob: new Date("2001-06-18"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        isVerified: false,
        bio: "Cricket enthusiast from Lucknow.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      addressee: {
        id: "u204",
        clerkId: "clerk_u204",
        name: "Kunal Singh",
        username: "kunals",
        email: "kunal@example.com",
        gender: "male",
        role: "player",
        dob: new Date("1998-11-22"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/men/14.jpg",
        isVerified: true,
        bio: "Left-arm spinner from Ranchi.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "fr3",
      status: "PENDING",
      requesterId: "u205",
      addresseeId: "u206",
      requester: {
        id: "u205",
        clerkId: "clerk_u205",
        name: "Riya Patel",
        username: "riyapatel",
        email: "riya@example.com",
        gender: "female",
        role: "player",
        dob: new Date("2002-03-04"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        isVerified: true,
        bio: "All-rounder, Ahmedabad Warriors.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      addressee: {
        id: "u206",
        clerkId: "clerk_u206",
        name: "Mohit Chauhan",
        username: "mohitch",
        email: "mohit@example.com",
        gender: "male",
        role: "fan",
        dob: new Date("2000-07-25"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        isVerified: false,
        bio: "Cricket blogger and analyst.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "fr4",
      status: "PENDING",
      requesterId: "u207",
      addresseeId: "u208",
      requester: {
        id: "u207",
        clerkId: "clerk_u207",
        name: "Aditya Rao",
        username: "adityarao",
        email: "aditya@example.com",
        gender: "male",
        role: "player",
        dob: new Date("1997-02-16"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/men/18.jpg",
        isVerified: true,
        bio: "Wicketkeeper and finisher.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      addressee: {
        id: "u208",
        clerkId: "clerk_u208",
        name: "Priya Nair",
        username: "priyanair",
        email: "priya@example.com",
        gender: "female",
        role: "fan",
        dob: new Date("2001-09-15"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/women/15.jpg",
        isVerified: false,
        bio: "Team supporter from Kerala.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "fr5",
      status: "PENDING",
      requesterId: "u209",
      addresseeId: "u210",
      requester: {
        id: "u209",
        clerkId: "clerk_u209",
        name: "Harsh Vardhan",
        username: "harshv",
        email: "harsh@example.com",
        gender: "male",
        role: "player",
        dob: new Date("1999-12-02"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/men/21.jpg",
        isVerified: true,
        bio: "Medium pacer, Hyderabad Hawks.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      addressee: {
        id: "u210",
        clerkId: "clerk_u210",
        name: "Simran Kaur",
        username: "simrankaur",
        email: "simran@example.com",
        gender: "female",
        role: "fan",
        dob: new Date("2000-05-07"),
        availability: "available",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        isVerified: false,
        bio: "Event manager and cricket fan.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  teamRequests: Array.from({ length: 5 }, (_, i) => ({
    id: `tmr${i + 1}`,
    fromId: `u3${i + 1}`,
    toId: `u4${i + 1}`,
    teamId: `team${i + 1}`,
    from: {
      id: `u3${i + 1}`,
      clerkId: `clerk_u3${i + 1}`,
      name: `Player ${i + 1}`,
      username: `player${i + 1}`,
      email: `player${i + 1}@example.com`,
      gender: "male",
      role: "player",
      dob: new Date("2000-01-01"),
      availability: "available",
      avatar: `https://randomuser.me/api/portraits/men/${40 + i}.jpg`,
      isVerified: true,
      bio: `Team join request sender ${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    to: {
      id: `u4${i + 1}`,
      clerkId: `clerk_u4${i + 1}`,
      name: `Captain ${i + 1}`,
      username: `captain${i + 1}`,
      email: `captain${i + 1}@example.com`,
      gender: "male",
      role: "player",
      dob: new Date("1998-06-15"),
      availability: "available",
      avatar: `https://randomuser.me/api/portraits/men/${20 + i}.jpg`,
      isVerified: true,
      bio: `Captain of team ${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    team: {
      id: `team${i + 1}`,
      name: `Team ${i + 1}`,
      logo: `https://placehold.co/60x60/${["4F46E5", "22C55E", "EF4444", "F59E0B", "06B6D4"][i]}/FFFFFF?text=T${i + 1}`,
      city: ["Mumbai", "Delhi", "Chennai", "Bangalore", "Hyderabad"][i],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  tournamentRequests: Array.from({ length: 5 }, (_, i) => ({
    id: `tqr${i + 1}`,
    teamId: `team${i + 1}`,
    tournamentId: `tourn${i + 1}`,
    team: {
      id: `team${i + 1}`,
      name: `Team ${i + 1}`,
      logo: `https://placehold.co/60x60/${["10B981", "6366F1", "DC2626", "F97316", "14B8A6"][i]}/FFFFFF?text=T${i + 1}`,
      city: ["Pune", "Jaipur", "Ahmedabad", "Kolkata", "Chandigarh"][i],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    tournament: {
      id: `tourn${i + 1}`,
      name: `National Cricket League ${2025 + i}`,
      banner: `https://placehold.co/300x150/${["2563EB", "059669", "B91C1C", "D97706", "0EA5E9"][i]}/FFFFFF?text=NCL+${2025 + i}`,
      location: ["Delhi", "Mumbai", "Chennai", "Hyderabad", "Lucknow"][i],
      startDate: new Date(`2025-11-${10 + i}`),
      endDate: new Date(`2025-11-${15 + i}`),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
};

export default function RequestsModal() {
  const [requests, setRequests] = useState(initialRequests);
  const [toggle, setToggle] = useState({
    friend: true,
    team: true,
    tournament: true,
  });
  const { isOpen, onClose } = useNotificationModal();

  const handleFriendAccept = (requestId: string) => {
    const filteredRequests = requests.friendRequests.filter((prev) => prev.id !== requestId);

    console.log(filteredRequests);

    setRequests((prev) => ({ ...prev, friendRequests: filteredRequests }));
  };

  const handleTeamAccept = (requestId: string) => {
    const filteredRequests = requests.teamRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      teamRequests: filteredRequests,
    }));
  };

  const handleTournamentAccept = (requestId: string) => {
    const filteredRequests = requests.tournamentRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      tournamentRequests: filteredRequests,
    }));
  };

  const handleFriendDecline = (requestId: string) => {
    const filteredRequests = requests.friendRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({ ...prev, friendRequests: filteredRequests }));
  };

  const handleTeamDecline = (requestId: string) => {
    const filteredRequests = requests.teamRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      teamRequests: filteredRequests,
    }));
  };

  const handleTournamentDecline = (requestId: string) => {
    const filteredRequests = requests.tournamentRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      tournamentRequests: filteredRequests,
    }));
  };

  const pendingCount =
    requests.friendRequests.length ||
    requests.teamRequests.length ||
    requests.tournamentRequests.length;

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl"
      >
        <DialogTitle />
        <DialogContent className="overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>Requests</DialogTitle>
          </DialogHeader>
          {pendingCount === 0 ? (
            <NotFoundParagraph description="You have no pending requests." />
          ) : (
            <div className="h-[50vh] items-start justify-start font-[poppins]">
              {requests.friendRequests.length !== 0 && (
                <>
                  <ToggleButton
                    state={toggle}
                    name="friend"
                    onClick={() => setToggle((prev) => ({ ...prev, friend: !prev.friend }))}
                  />
                  {toggle.friend && (
                    <ul className="mb-2 space-y-4">
                      {requests.friendRequests.map((request) => {
                        const user = request.addressee || request.requester;
                        return (
                          <li key={user.id} className="flex items-center space-x-3">
                            <img
                              src={
                                user.avatar ||
                                "https://placehold.co/40x40/E0E7FF/4F46E5?text=Avatar"
                              }
                              alt={`${user.name}'s avatar`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{user.name}</p>
                              <p className="flex items-center text-sm text-gray-500">
                                <span className="mr-1.5">
                                  <UserPlus className="h-4 w-4" />
                                </span>
                                sent you a friend request.
                              </p>
                            </div>
                            <div className="flex shrink-0 space-x-2">
                              <button
                                onClick={() => handleFriendAccept(request.id)}
                                className="rounded-full p-2 text-green-600 transition hover:bg-green-100"
                                title="Accept"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleFriendDecline(request.id)}
                                className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                                title="Decline"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
              {requests.teamRequests.length !== 0 && (
                <>
                  <ToggleButton
                    state={toggle}
                    name="team"
                    onClick={() => setToggle((prev) => ({ ...prev, team: !prev.team }))}
                  />
                  {toggle.team && (
                    <ul className="mb-2 space-y-4">
                      {requests.teamRequests.map((request) => {
                        return (
                          <li key={request.id} className="flex items-center space-x-3">
                            <img
                              src={
                                request.team.logo ||
                                "https://placehold.co/40x40/E0E7FF/4F46E5?text=Avatar"
                              }
                              alt={`${request.team.name}'s avatar`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {request.team.name}
                              </p>
                              <p className="flex items-center text-sm text-gray-500">
                                <span className="mr-1.5">
                                  <ShieldPlus className="h-4 w-4" />
                                </span>
                                sent you a team request.
                              </p>
                            </div>
                            <div className="flex shrink-0 space-x-2">
                              <button
                                onClick={() => handleTeamAccept(request.id)}
                                className="rounded-full p-2 text-green-600 transition hover:bg-green-100"
                                title="Accept"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleTeamDecline(request.id)}
                                className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                                title="Decline"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
              {requests.tournamentRequests.length !== 0 && (
                <>
                  <ToggleButton
                    state={toggle}
                    name="tournament"
                    onClick={() =>
                      setToggle((prev) => ({ ...prev, tournament: !toggle.tournament }))
                    }
                  />
                  {toggle.tournament && (
                    <ul className="mb-2 space-y-4">
                      {requests.tournamentRequests.map((request) => {
                        return (
                          <li key={request.id} className="flex items-center space-x-3">
                            {/* <Trophy className="h-6 w-6 rounded-full" />
                             */}
                            <img src="/trophy.svg" alt="" width={40} height={40} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {request.tournament.name}
                              </p>
                              <p className="flex items-center text-sm text-gray-500">
                                <span className="mr-1.5">
                                  <Trophy className="h-4 w-4" />
                                </span>
                                sent you a tournament request.
                              </p>
                            </div>
                            <div className="flex shrink-0 space-x-2">
                              <button
                                onClick={() => handleTournamentAccept(request.id)}
                                className="rounded-full p-2 text-green-600 transition hover:bg-green-100"
                                title="Accept"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleTournamentDecline(request.id)}
                                className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                                title="Decline"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}

interface ToggleButtonProps {
  state: {
    friend: boolean;
    team: boolean;
    tournament: boolean;
  };
  name: "friend" | "team" | "tournament";
  onClick: () => void;
}

const ToggleButton = ({ state, name, onClick }: ToggleButtonProps) => {
  return (
    <button onClick={onClick} className="mb-2 flex w-full items-center justify-between">
      <h3 className="font-[cal_sans]">{capitalize(`${name} Requests`)}</h3>
      {state[name] ? <ChevronUp /> : <ChevronLeft />}
    </button>
  );
};
