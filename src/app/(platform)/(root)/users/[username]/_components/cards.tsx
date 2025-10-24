"use client";

import { removeFriend, sendFriendRequest, widthdrawFriendRequest } from "@/actions/user-actions";
import Spinner from "@/components/Spinner";
import { Availability, Friendship, Team, User } from "@/generated/prisma";
import { useAction } from "@/hooks/useAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import { FaSuperpowers } from "react-icons/fa6";
import { CheckCircle, UserPlus, UserCheck, Clock, Calendar, MapPin, Info } from "lucide-react";

interface ProfileCardProps {
  user: User;
  currentUser: User;
}

interface DescriptionProps {
  user: User;
}

export const ProfileCard = ({ user, currentUser }: ProfileCardProps) => {
  const queryClient = useQueryClient();

  const { execute: sendReq, isLoading } = useAction(sendFriendRequest, {
    onSuccess: (data) => {
      console.log("Request sent:", data);
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
    onError: (err) => console.error(err),
  });

  const { execute: deleteFriend, isLoading: isDeleting } = useAction(removeFriend, {
    onSuccess: (data) => {
      console.log("Friend removed:", data);
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
  });

  const { execute: widthdrawReq, isLoading: isWidthdrawing } = useAction(widthdrawFriendRequest, {
    onSuccess: (data) => {
      console.log("Request withdrawn:", data);
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
    onError: (err) => console.error(err),
  });

  const { data: friendRequest } = useQuery<Friendship[]>({
    queryKey: ["friend-requests", user.id],
    queryFn: async () => {
      const res = await axios.get(`/api/users/friends/requests/${user.id}`);
      return res.data;
    },
  });

  const friendshipStatus: "none" | "pending" | "declined" | "blocked" | "accepted" = useMemo(() => {
    if (!friendRequest || friendRequest.length === 0) return "none";

    const req = friendRequest.find((r) => r.requesterId === currentUser.id);
    if (!req) return "none";

    switch (req.status) {
      case "PENDING":
        return "pending";
      case "DECLINED":
        return "declined";
      case "BLOCKED":
        return "blocked";
      case "ACCEPTED":
        return "accepted";
      default:
        return "none";
    }
  }, [friendRequest, currentUser.id]);

  const handleFriendRequest = () => {
    if (friendshipStatus === "none" || friendshipStatus === "declined") {
      sendReq({ addresseeId: user.id, username: user.username });
    } else if (friendshipStatus === "pending") {
      widthdrawReq({ addresseeId: user.id, username: user.username });
    } else if (friendshipStatus === "accepted") {
      deleteFriend({ addresseeId: user.id, username: user.username });
    }
  };

  const getAvailabilityClass = (availability: Availability) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "injured":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      case "on_break":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
    }
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="h-24 bg-gradient-to-r from-green-600 via-emerald-700 to-green-700"></div>
        <div className="-mt-16 p-6 text-center font-[poppins]">
          {/* Avatar */}
          <div className="relative mx-auto h-32 w-32">
            <img
              id="avatar"
              src={user.avatar || "/user.svg"}
              alt={user.name}
              className="h-full w-full rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-slate-800"
            />
            {user.isVerified && (
              <div
                className="absolute right-1 bottom-1 rounded-full border-2 border-white bg-blue-500 p-1 dark:border-slate-800"
                title="Verified User"
              >
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Name & Username */}
          <h2
            id="userName"
            className="mt-4 font-[cal_sans] text-lg font-semibold text-slate-900 dark:text-white"
          >
            {user.name}
          </h2>
          <p
            id="userUsername"
            className="font-[urbanist] text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400"
          >
            @{user.username}
          </p>

          {/* Availability */}
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getAvailabilityClass(user.availability)}`}
          >
            <span
              className={`h-1 w-1 rounded-full ${
                user.availability === "available"
                  ? "animate-ping bg-green-500"
                  : user.availability === "injured"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            ></span>
            <span id="availabilityStatus" className="capitalize">
              {user.availability.replace("_", " ")}
            </span>
          </div>

          {/* ✅ Friendship Button */}
          <abbr title={friendshipStatus} className="absolute top-28 right-2">
            {(friendshipStatus === "none" ||
              friendshipStatus === "pending" ||
              friendshipStatus === "declined" ||
              friendshipStatus === "accepted") && (
              <button
                id="friendRequestBtn"
                onClick={handleFriendRequest}
                disabled={isLoading || isDeleting || isWidthdrawing}
                className={`center flex transform cursor-pointer gap-1 rounded-full p-2 transition-all duration-300 ${
                  friendshipStatus === "none"
                    ? "bg-gradient-to-r from-emerald-700 to-green-900 px-4 text-white shadow-md shadow-emerald-500/50 dark:shadow-emerald-800/50"
                    : friendshipStatus === "pending"
                      ? "cursor-not-allowed bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      : friendshipStatus === "accepted"
                        ? "bg-red-600 px-4 text-white hover:bg-red-700"
                        : "cursor-default bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                }`}
              >
                {isLoading || isDeleting || isWidthdrawing ? (
                  <Spinner />
                ) : (
                  <>
                    {friendshipStatus === "none" && <UserPlus className="h-4 w-4" />}
                    {friendshipStatus === "pending" && <Clock className="h-4 w-4" />}
                    <span className="text-sm">
                      {friendshipStatus === "none"
                        ? "Add"
                        : friendshipStatus === "pending"
                          ? "Sent"
                          : friendshipStatus === "accepted"
                            ? "Remove"
                            : ""}
                    </span>
                  </>
                )}
              </button>
            )}
          </abbr>

          {/* Info Section */}
          <div className="mt-6 space-y-4 border-t border-slate-200 pt-4 text-left dark:border-slate-700">
            <InfoItem
              icon={<FaSuperpowers className="h-5 w-5 text-slate-400" />}
              label="Role"
              value={user.role}
              id="userRole"
            />
            <InfoItem
              icon={<MapPin className="h-5 w-5 text-slate-400" />}
              label="Location"
              value={
                user.address ? `${user.address?.city}, ${user.address?.country}` : "Not provided"
              }
              id="userLocation"
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-slate-400" />}
              label="Joined"
              value={formatDate(new Date(user.createdAt))}
              id="userJoinedDate"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Description = ({ user }: DescriptionProps) => {
  const [activeTab, setActiveTab] = useState("about");
  const userTeams: any = [];
  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutCard user={user} />;
      case "teams":
        return <TeamsCard teams={userTeams} />;
      case "stats":
        return <StatsCard />;
      default:
        return null;
    }
  };

  const TabButton = ({ name, label }: any) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`relative rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
        activeTab === name
          ? "text-green-600 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {label}
      {activeTab === name && (
        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-green-500"></span>
      )}
    </button>
  );

  return (
    <div className="card overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 px-6 pt-2 dark:border-slate-700">
        <nav className="flex space-x-2">
          <TabButton name="about" label="About" />
          <TabButton name="teams" label="Teams" />
          <TabButton name="stats" label="Career Stats" />
        </nav>
      </div>
      <div className="min-h-[300px] p-6 font-[poppins]">{renderTabContent()}</div>
    </div>
  );
};

export const InfoItem = ({ icon, label, value, id }: any) => (
  <div className="flex items-start">
    <div className="w-8 flex-shrink-0 pt-1">{icon}</div>
    <div className="ml-2">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p id={id} className="text-sm text-slate-800 capitalize dark:text-slate-200">
        {value}
      </p>
    </div>
  </div>
);

export const AboutCard = ({ user }: any) => {
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">Bio</h3>
        <p className="prose prose-sm dark:prose-invert leading-relaxed text-slate-600 dark:text-slate-300">
          {user.bio}
        </p>
      </div>
      <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Personal Information
        </h3>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{user.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Email Address
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{user.email}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Contact</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {user.contact || "Not provided"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Gender</dt>
            <dd className="mt-1 text-sm text-slate-900 capitalize dark:text-slate-100">
              {user.gender}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Date of Birth
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {new Date(user.dob).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              ({calculateAge(user.dob)} years)
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export const TeamsCard = ({ teams }: any) => {
  if (teams.length === 0) {
    return (
      <p className="text-slate-500 dark:text-slate-400">This user is not a part of any team yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team: any) => (
        <div
          key={team.id}
          className="flex items-center rounded-xl bg-slate-100 p-4 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/60"
        >
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="mr-4 h-12 w-12 rounded-lg object-cover"
          />
          <div className="flex-grow">
            <p className="font-semibold text-slate-800 dark:text-slate-100">{team.name}</p>
            <p className="text-sm text-slate-500 capitalize dark:text-slate-400">{team.type}</p>
          </div>
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-200">
            {team.role}
          </span>
        </div>
      ))}
    </div>
  );
};

export const StatsCard = () => {
  return (
    <div className="py-10 text-center">
      <Info className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-500" />
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Coming Soon!</h3>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Detailed career statistics will be available here soon.
      </p>
    </div>
  );
};
