"use client";

import { removeFriend, sendFriendRequest, cancelFriendRequest } from "@/actions/user-actions";
import Spinner from "@/components/Spinner";
import { Availability, Friendship, Team, User } from "@/generated/prisma";
import { useAction } from "@/hooks/useAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaSuperpowers } from "react-icons/fa6";
import {
  CheckCircle,
  UserPlus,
  Clock,
  Calendar,
  MapPin,
  Info,
  UserCheck2,
  Users,
} from "lucide-react";
import { calculateAge } from "@/utils/helper/calculateAge";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { capitalize } from "lodash";
import { toast } from "sonner";
import { useFriendsModal } from "@/hooks/store/use-friends";
import { FriendshipWithBoth } from "@/lib/types";
import { getFriends } from "@/utils/helper/getFriends";
import { formatDate } from "@/utils/helper/formatDate";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { getAvailabilityClass } from "@/utils/helper/classes";
interface ProfileCardProps {
  user: User;
  currentUser: User;
  friends: Friendship[] | [];
}

interface UserProfilePage {
  user: User;
  currentUser: User;
}

interface DescriptionProps {
  user: User;
  friends: any;
  currentUser: User;
}

export default function UserProfile({ user, currentUser }: UserProfilePage) {
  const { data: friends, isLoading: friendsLoading } = useQuery<Friendship[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await axios.get(`/api/users/friends/${user.id}`);
      return res.data;
    },
  });

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
      <ProfileCard friends={friends || []} currentUser={currentUser} user={user} />
      <div className="lg:col-span-2">
        <Description currentUser={currentUser} user={user} friends={friends} />
      </div>
    </div>
  );
}

export const ProfileCard = ({ user, currentUser, friends }: ProfileCardProps) => {
  const queryClient = useQueryClient();

  const { confirmModalState, openConfirmModal, closeConfirmModal } = useConfirmModal();

  const { execute: sendReq, isLoading } = useAction(sendFriendRequest, {
    onSuccess: (data) => {
      toast.success("Request sent");
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
    onError: (err) => toast.error(err),
  });

  const { execute: deleteFriend, isLoading: isDeleting } = useAction(removeFriend, {
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
  const { execute: cancelReq, isLoading: isCanceling } = useAction(cancelFriendRequest, {
    onSuccess: (data) => {
      toast.success("Request Cancelled");
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
    onError: (err) => toast.error(err),
  });

  const { data: friendRequest, isLoading: requestsLoading } = useQuery<Friendship[]>({
    queryKey: ["friend-requests", user.id],
    queryFn: async () => {
      const res = await axios.get(`/api/users/friends/requests/${user.id}`);
      return res.data;
    },
  });

  const requestStatus: "none" | "pending" | "declined" | "blocked" | "accepted" = useMemo(() => {
    if ((!friendRequest || friendRequest.length === 0) && (!friends || friends.length === 0))
      return "none";

    const req = friendRequest?.find((r) => r.requesterId === currentUser.id);

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

  const [friendshipStatus, setFriendshipStatus] = useState<"accepted" | "none">("none");

  const handleFriendRequest = (status: string) => {
    if (status === "none" || status === "declined") {
      sendReq({ addresseeId: user.id, username: user.username });
    } else if (status === "pending") {
      cancelReq({ addresseeId: user.id, username: user.username });
    } else if (status === "accepted") {
      deleteFriend({ addresseeId: user.id, username: user.username });
    }
  };

  useEffect(() => {
    const friend = friends?.find(
      (fr) => fr.requesterId === currentUser.id || fr.addresseeId === currentUser.id
    );

    setFriendshipStatus(friend ? "accepted" : "none");
  }, [friends, currentUser]);

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
            className="secondary-text font-[urbanist] text-sm font-semibold tracking-wide"
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

          <div title={requestStatus || friendshipStatus} className="absolute top-28 right-2">
            {(() => {
              const status = requestStatus === "none" ? friendshipStatus : requestStatus;

              const loading = isLoading || isDeleting || isCanceling || requestsLoading;

              const base =
                "center flex transform cursor-pointer gap-1 rounded-full p-2 transition-all duration-300";
              const classes =
                status === "none"
                  ? `${base} bg-gradient-to-r from-emerald-700 to-green-900 px-4 text-white shadow-md shadow-emerald-500/50 dark:shadow-emerald-800/50`
                  : status === "pending"
                    ? `${base} cursor-not-allowed bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300`
                    : status === "accepted"
                      ? `${base} bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300`
                      : status === "blocked"
                        ? `${base} cursor-default bg-gray-400 text-white`
                        : `${base} cursor-default bg-gradient-to-r from-green-500 to-emerald-600 text-white`;

              const icon =
                status === "none" ? (
                  <UserPlus className="h-4 w-4" />
                ) : status === "pending" ? (
                  <Clock className="h-4 w-4" />
                ) : status === "accepted" ? (
                  <UserCheck2 className="h-4 w-4" />
                ) : null;

              const label =
                status === "none"
                  ? "Add"
                  : status === "pending"
                    ? "Sent"
                    : status === "accepted"
                      ? "Remove"
                      : status === "blocked"
                        ? "Blocked"
                        : "";

              return (
                <button
                  id="friendRequestBtn"
                  onClick={() => {
                    if (status === "none" || status === "declined") {
                      handleFriendRequest(status);
                    } else if (status !== "blocked") {
                      const action =
                        status === "accepted" ? "remove this friend" : "cancel the request";
                      openConfirmModal({
                        title: capitalize(status),
                        description: `Are you sure you want to ${action}?`,
                        onConfirm: () => handleFriendRequest(status),
                      });
                    }
                  }}
                  disabled={isLoading || isDeleting || isCanceling}
                  className={`${classes} center flex`}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      {icon}
                      <span className="text-[10px]">{label}</span>
                    </>
                  )}
                </button>
              );
            })()}
          </div>

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
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
    </div>
  );
};

type TabProps = "about" | "teams" | "stats" | "friends";

export const Description = ({ currentUser, user, friends }: DescriptionProps) => {
  const [activeTab, setActiveTab] = useState<TabProps>("about");
  const { onOpen } = useFriendsModal();
  const userTeams: any = [];
  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutCard user={user} />;
      case "teams":
        return <TeamsCard teams={userTeams} />;
      case "stats":
        return <StatsCard />;
      case "friends":
        return <FriendsCard user={user} friendships={friends} currentUser={currentUser} />;
      default:
        return null;
    }
  };

  const TabButton = ({ name, label }: { name: TabProps; label: string }) => (
    <button
      onClick={() => {
        if (name === "friends") {
          onOpen();
        }
        setActiveTab(name);
      }}
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
          <TabButton name="friends" label="Friends List" />
        </nav>
      </div>
      <div className="min-h-[300px] overflow-y-auto p-6 font-[poppins] lg:max-h-[450px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export const InfoItem = ({ icon, label, value, id }: any) => (
  <div className="flex items-start">
    <div className="w-8 flex-shrink-0 pt-1">{icon}</div>
    <div className="ml-2">
      <p className="secondary-text text-sm font-medium">{label}</p>
      <p id={id} className="text-sm text-slate-800 capitalize dark:text-slate-200">
        {value}
      </p>
    </div>
  </div>
);

export const AboutCard = ({ user }: any) => {
  return (
    <div className="space-y-8">
      {user.bio && (
        <div className="border-b pb-4 text-slate-800 dark:text-slate-100">
          <h3 className="primary-text mb-2 text-lg font-semibold">Bio</h3>
          <p className="prose prose-sm dark:prose-invert secondary-text leading-relaxed">
            {user.bio}
          </p>
        </div>
      )}

      <div className="">
        <h3 className="primary-text mb-4 text-lg font-semibold">Personal Information</h3>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="secondary-text text-sm font-medium">Full Name</dt>
            <dd className="primary-text mt-1 text-sm">{user.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="secondary-text text-sm font-medium">Email Address</dt>
            <dd className="primary-text mt-1 text-sm">{user.email}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="secondary-text text-sm font-medium">Contact</dt>
            <dd className="primary-text mt-1 text-sm">{user.contact || "Not provided"}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="secondary-text text-sm font-medium">Gender</dt>
            <dd className="mt-1 text-sm text-slate-900 capitalize dark:text-slate-100">
              {user.gender}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="secondary-text text-sm font-medium">Date of Birth</dt>
            <dd className="primary-text mt-1 text-sm">
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
    return <p className="secondary-text">This user is not a part of any team yet.</p>;
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
      <p className="secondary-text mt-1">Detailed career statistics will be available here soon.</p>
    </div>
  );
};

export const FriendsCard = ({
  friendships,
  currentUser,
  user,
}: {
  friendships: FriendshipWithBoth[];
  currentUser: User;
  user: User;
}) => {
  // const friends = getFriends(friendships, user.id);
  const friends = [
    {
      name: "Irfanul Madar",
      username: "irfanulmadar",
      id: "68bfff1352d145237486a875",
      avatar: "https://localhost/api/portraits/men/1.jpg",
    },
    {
      name: "Ayaan Khan",
      username: "ayaankhan",
      id: "a14c2bfc93c5462a9d2a33a1",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Sofia Rahman",
      username: "sofiarahman",
      id: "b52a99f27e9c478ab7d0213c",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      name: "Hamza Ali",
      username: "hamzaali",
      id: "cf96b112e8a84e729d66f009",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      name: "Fatima Noor",
      username: "fatimanoor",
      id: "db8f38c22f53422a9121d56b",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      name: "Omar Siddiqui",
      username: "omarsiddiqui",
      id: "e62f932c38b64a6bb2a3b765",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      name: "Aisha Patel",
      username: "aishapatel",
      id: "f431b9c04a7b47f19a21e892",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
      name: "Yusuf Ahmed",
      username: "yusufahmed",
      id: "012f67dc28a44d2b8b79c1a4",
      avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    },
    {
      name: "Zara Sheikh",
      username: "zarasheikh",
      id: "1a8e25cf94b948ce9de215f0",
      avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    },
    {
      name: "Bilal Khan",
      username: "bilalkhan",
      id: "2e6cba0d03d14abbb03f33d7",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    {
      name: "Maryam Ali",
      username: "maryamali",
      id: "34f8b1f52e024ba19d5d9084",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    },
    {
      name: "Imran Hussain",
      username: "imranhussain",
      id: "4c9f6e0d5bca45f4a234765d",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      name: "Layla Ahmed",
      username: "laylaahmed",
      id: "59de32bf18e641c9b765aa12",
      avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    },
    {
      name: "Salman Qureshi",
      username: "salmanqureshi",
      id: "6f3b7e29ab7f47b98ac2ff09",
      avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    {
      name: "Hiba Ansari",
      username: "hibaansari",
      id: "7d41e62c3e3e4581b2bba894",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
      name: "Rayan Malik",
      username: "rayanmalik",
      id: "8e2f5d7b4c8b4292c9a1bda7",
      avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    },
    {
      name: "Nadia Khan",
      username: "nadiakhan",
      id: "9bdf1a5a43f44b1cb82dce42",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    },
    {
      name: "Tariq Mahmood",
      username: "tariqmahmood",
      id: "a8e4f7b23b9242d1a75f0041",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    },
    {
      name: "Sara Iqbal",
      username: "saraiqbal",
      id: "b5c7a0e99e9b4708a09dd664",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    },
    {
      name: "Farhan Sheikh",
      username: "farhansheikh",
      id: "c3b42e1d5c3843f0b7d84f91",
      avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()} className="overflow-hidden">
      <div className="border-b p-4">
        <h1 className="flex items-center text-xl font-semibold">
          <Users className="mr-2 h-6 w-6" />
          Friends
        </h1>
      </div>

      {/* Friend List */}
      <div className="w-full overflow-y-auto p-4">
        {friends.length === 0 ? (
          <p className="py-4 text-center">You don't have any friends yet.</p>
        ) : (
          <ul className="space-y-3">
            {friends.map((friend) => {
              const you = currentUser.id === friend.id;

              return (
                <li
                  key={friend.id}
                  className="flex w-full items-center justify-between bg-gray-50 hover:opacity-80 dark:bg-gray-800"
                >
                  <a
                    href={you ? "/profile" : `/users/${friend.username}`}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="relative flex items-center rounded-md p-2 transition"
                  >
                    <img
                      src={friend?.avatar || "/user.svg"}
                      alt={`${friend.name}'s avatar`}
                      width={40}
                      height={40}
                      onError={(e) => {
                        e.currentTarget.src = "/user.svg";
                        e.currentTarget.onerror = null;
                      }}
                      className="rounded-full"
                    />
                    <div className="ml-3 font-[poppins]">
                      <p className="primary-text font-medium">{friend.name}</p>
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                    </div>
                    {you && (
                      <span className="primary-text absolute top-4 -right-4 text-[8px]">
                        {"(You)"}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
