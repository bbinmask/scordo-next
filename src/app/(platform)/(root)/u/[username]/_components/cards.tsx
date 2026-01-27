"use client";

import {
  removeFriend,
  sendFriendRequest,
  cancelFriendRequest,
  acceptRequest,
} from "@/actions/user-actions";
import Spinner from "@/components/Spinner";
import { Friendship, User } from "@/generated/prisma";
import { useAction } from "@/hooks/useAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { BentoCard } from "../../../_components/cards/bento-card";
import {
  UserPlus,
  Clock,
  Calendar,
  MapPin,
  Info,
  UserCheck2,
  Users,
  UserIcon,
  ShieldCheck,
  Zap,
  BarChart3,
  Mail,
  ExternalLink,
  Gamepad2,
  Trophy,
  LucideIcon,
  Check,
} from "lucide-react";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { toast } from "sonner";
import { useFriendsModal } from "@/hooks/store/use-friends";
import { FriendshipWithBoth } from "@/lib/types";
import { getFriends } from "@/utils/helper/getFriends";
import { formatDate } from "@/utils/helper/formatDate";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { getAvailabilityClass } from "@/utils/helper/classes";
import OptionsPopover from "@/components/modals/OptionsPopover";
import { useAskToJoinModal, useJoinTheirTeamModal } from "@/hooks/store/use-user";
import { AskToJoinTeamModal } from "./modal";
import { getFullAddress } from "@/utils";
interface ProfileCardProps {
  user: User;
  currentUser: User;
  friends: Friendship[] | [];
}

const capitalize = (str: string) => {
  if (!str) return "N/A";
  const label = str.replace(/-/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
};

const ProfilePage = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();

  const { isOpen: isAskJoin, onClose: askJoinClose, onOpen: askJoinOpen } = useAskToJoinModal();
  const {
    isOpen: isJoinTheirTeam,
    onClose: joinTheirTeamClose,
    onOpen: joinTheirTeamOpen,
  } = useJoinTheirTeamModal();

  const optionsData = [
    {
      onClose: () => {},
      onOpen: askJoinOpen,
      label: "Ask to join team",
    },
    {
      onClose: () => {},
      onOpen: joinTheirTeamOpen,
      label: "Join their team",
    },
  ];

  const [currentTab, setCurrentTab] = useState("statschart");
  const [friendshipStatus, setFriendshipStatus] = useState<
    "accepted" | "none" | "declined" | "pending" | "recieved" | "blocked"
  >("none");

  const { data: friends, isLoading: friendsLoading } = useQuery<Friendship[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await axios.get(`/api/friends/${user.id}`);
      return res.data;
    },
  });

  const { data: request, isLoading: requestsLoading } = useQuery<Friendship>({
    queryKey: ["friend-request", user.id],
    queryFn: async () => {
      const res = await axios.get(`/api/u/friends/${user.id}/status`);

      if (res.status < 400) {
        setFriendshipStatus(res.data.data?.status.toLowerCase());
      }

      return res.data.data;
    },
  });

  const { confirmModalState, openConfirmModal, closeConfirmModal } = useConfirmModal();

  const { execute: sendReq, isLoading } = useAction(sendFriendRequest, {
    onSuccess: (data) => {
      toast.success("Request sent");
      setFriendshipStatus("pending");
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const { execute: deleteFriend, isLoading: isDeleting } = useAction(removeFriend, {
    onSuccess: (_) => {
      toast.success("Removed!");
      setFriendshipStatus("none");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { execute: cancelReq, isLoading: isCanceling } = useAction(cancelFriendRequest, {
    onSuccess: (data) => {
      toast.success("Request Cancelled");
      setFriendshipStatus("none");
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
    onError: (err) => toast.error(err),
  });

  const { execute: acceptReq, isLoading: isAccepting } = useAction(acceptRequest, {
    onSuccess: (data) => {
      toast.success("Request Accepted");
      setFriendshipStatus("accepted");

      queryClient.invalidateQueries({ queryKey: ["friend-requests", user.id] });
    },
    onError: (err) => toast.error(err),
  });

  const handleFriendRequest = (status: typeof friendshipStatus) => {
    if (status === "none" || status === "declined") {
      sendReq({ addresseeId: user.id, username: user.username });
    }
    if (request?.id) {
      if (status === "recieved") {
        acceptReq({ reqId: request.id, reqUsername: user.username });
      } else if (status === "pending") {
        cancelReq({ addresseeId: user.id, username: user.username });
      } else if (status === "accepted") {
        deleteFriend({ addresseeId: user.id, username: user.username });
      }
    }
  };

  return (
    <div className="bg-slate-50 pb-12 font-sans text-slate-900 transition-colors duration-500 xl:rounded-md dark:bg-[#020617] dark:text-slate-100">
      {/* Hero Banner Area */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-green-800 md:h-80">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent dark:from-[#020617]" />
      </div>

      <div className="relative z-10 mx-auto -mt-32 max-w-6xl px-4">
        {/* Top Header Card */}
        <div className="mb-8 flex flex-col items-start gap-6 md:flex-row">
          <div className="group relative">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border-8 border-white bg-slate-200 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] md:h-48 md:w-48 dark:border-slate-900 dark:bg-slate-800">
              {user.avatar ? (
                <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-20 w-20 text-slate-400" />
              )}
            </div>
            {user.isVerified && (
              <div className="absolute -right-2 -bottom-2 rounded-2xl bg-green-500 p-2 text-white shadow-xl ring-4 ring-white dark:ring-slate-900">
                <ShieldCheck className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex w-full items-center justify-between md:mt-28">
            <div className="flex-1 pb-2 text-left">
              <div className="flex flex-wrap items-center justify-start gap-3">
                <h1 className="font-[cal_sans] text-3xl font-semibold tracking-wide md:text-5xl">
                  {user.name}
                </h1>
              </div>
              <p className="mt-1 font-[urbanist] text-base font-semibold text-slate-500 dark:text-slate-400">
                @{user.username}
              </p>
            </div>

            <div className="flex items-center gap-3 pb-2 md:w-auto">
              {(() => {
                const status = friendshipStatus;

                const loading =
                  isLoading || isDeleting || isCanceling || requestsLoading || isAccepting;

                const base =
                  "center flex transform cursor-pointer gap-1 rounded-full p-2 transition-all duration-300";
                const classes =
                  status === "none"
                    ? `${base} primary-btn shadow-lg shadow-green-500/30 px-4 text-white shadow-md shadow-emerald-500/50 dark:shadow-emerald-800/50`
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
                  ) : status === "recieved" ? (
                    <Check className="h-4 w-4" />
                  ) : status === "pending" ? (
                    <Clock className="h-4 w-4" />
                  ) : status === "accepted" ? (
                    <UserCheck2 className="h-4 w-4" />
                  ) : null;

                const label =
                  status === "none"
                    ? "Add"
                    : status === "recieved"
                      ? "Accept"
                      : status === "pending"
                        ? "Sent"
                        : status === "accepted"
                          ? "Remove"
                          : status === "blocked"
                            ? "Blocked"
                            : "";

                return (
                  <button
                    onClick={() => {
                      if (status === "none" || status === "declined") {
                        handleFriendRequest(status);
                      } else if (status !== "blocked") {
                        const action =
                          status === "accepted"
                            ? "remove this friend"
                            : status === "recieved"
                              ? "accept the request"
                              : "cancel the request";
                        openConfirmModal({
                          confirmText:
                            status === "accepted"
                              ? "Remove"
                              : status === "recieved"
                                ? "Accept"
                                : "Undo",
                          confirmVariant: status === "accepted" ? "destructive" : "secondary",
                          title: capitalize(status),
                          description: `Are you sure you want to ${action}?`,
                          onConfirm: () => handleFriendRequest(status),
                        });
                      }
                    }}
                    disabled={loading}
                    className={`${classes} flex max-w-32 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 font-[urbanist] text-base transition-all active:scale-95 md:flex-none`}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        {icon}
                        {label}
                      </>
                    )}
                  </button>
                );
              })()}

              <OptionsPopover data={optionsData} />
            </div>
          </div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Bio - Large Box */}
          <BentoCard className="md:col-span-8" title="Bio" icon={Info}>
            <p className="secondary-text font-[urbanist] text-base leading-relaxed font-semibold md:text-lg">
              {user.bio}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-green-500" />
                {getFullAddress(user.address)}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4 text-green-500" />
                Member since {formatDate(new Date(user.createdAt))?.split(",")?.[1]}
              </div>
            </div>
          </BentoCard>

          {/* Quick Stats Summary */}
          <BentoCard
            className="bg-green-600 !text-white md:col-span-4 dark:bg-green-600"
            title="Quick Stats"
            icon={BarChart3}
          >
            <div className="grid h-full grid-cols-2 content-center gap-4">
              <div>
                <p className="font-[poppins] text-xs font-semibold text-green-600 uppercase dark:text-green-200">
                  Win Rate
                </p>
                {/* <p className="text-3xl font-black">{user.winRate}</p> */}
              </div>
              <div>
                <p className="font-[poppins] text-xs font-semibold text-green-600 uppercase dark:text-green-200">
                  Matches
                </p>
                {/* <p className="text-3xl font-black">{user.matches}</p> */}
              </div>
              <div className="col-span-2 pt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/20 dark:bg-white/20">
                  <div className="h-full w-[68%] bg-green-600"></div>
                </div>
                <p className="mt-2 font-[urbanist] text-[10px] font-semibold tracking-wide text-green-100 uppercase">
                  Progress
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Personal Info Grid - Columnized */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-12 lg:grid-cols-4">
            <BentoCard title="Email Address" icon={Mail}>
              <p className="truncate font-[urbanist] text-sm font-semibold">{user.email}</p>
            </BentoCard>
            <BentoCard title="Date of Birth" icon={Calendar}>
              <p className="font-[urbanist] text-sm font-semibold">
                {formatDate(new Date(user.dob))}
              </p>
            </BentoCard>
            <BentoCard title="Availability" icon={Zap}>
              <p className="font-[urbanist] text-sm font-semibold text-green-500">
                {user.availability}
              </p>
            </BentoCard>
            <BentoCard title="Friends" icon={Users}>
              <p className="font-[urbanist] text-sm font-semibold">{friends?.length}</p>
            </BentoCard>
          </div>

          {/* Main Content Tabs Area */}
          <div className="mt-4 md:col-span-12">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 px-2 md:flex-row">
              <div className="flex w-full gap-1 overflow-x-auto rounded-2xl bg-slate-200/50 p-1 backdrop-blur-sm md:w-auto dark:bg-white/5">
                {["statschart", "match-stats", "tournament-stats"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`rounded-xl px-6 py-2 font-[urbanist] text-sm font-semibold whitespace-nowrap transition-all ${
                      currentTab === tab
                        ? "bg-white text-green-600 shadow-sm dark:bg-green-600 dark:text-white"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {capitalize(tab)}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 font-[urbanist] text-sm font-semibold text-green-500 hover:underline">
                View Full History <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-slate-900/30">
              <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-5">
                <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-green-500 blur-[100px]"></div>
                <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-emerald-500 blur-[100px]"></div>
              </div>

              <div className="relative z-10 text-center">
                <div className="mb-4 inline-block rounded-3xl bg-slate-100 p-4 shadow-inner dark:bg-slate-800">
                  {currentTab === "statschart" && (
                    <BarChart3 className="h-12 w-12 text-green-500" />
                  )}
                  {currentTab === "match-stats" && (
                    <Gamepad2 className="h-12 w-12 text-emerald-500" />
                  )}
                  {currentTab === "tournament-stats" && (
                    <Trophy className="h-12 w-12 text-amber-500" />
                  )}
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">
                  Loading {capitalize(currentTab)}...
                </h3>
                <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                  Synchronizing with match servers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
      <AskToJoinTeamModal user={user} isOpen={isAskJoin} onClose={askJoinClose} />
    </div>
  );
};

export default ProfilePage;

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
                    href={you ? "/profile" : `/u/${friend.username}`}
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
