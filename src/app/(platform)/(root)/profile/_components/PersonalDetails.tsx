"use client";

import { User } from "@/generated/prisma";
import { checkAvailability, getFullAddress } from "@/utils";
import { capitalize } from "lodash";
import {
  BarChart3,
  Calendar,
  CalendarIcon,
  Clock,
  ExternalLink,
  Gamepad2,
  Info,
  Mail,
  MailIcon,
  MapPin,
  ShieldCheck,
  Trophy,
  UserIcon,
  Users,
  Verified,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { CgGenderFemale, CgGenderMale } from "react-icons/cg";
import { MdLeaderboard, MdLocationPin, MdOutlineEventAvailable } from "react-icons/md";
import StatsChart from "./StatsChart";
import MatchStats from "./MatchStats";
import TournamentStats from "./TournamentStats";
import Tabs from "../../_components/Tabs";
import FriendRequests from "./FriendRequests";
import { useForm } from "react-hook-form";
import { ProfileFormData } from "../page";
import { useFriendsModal } from "@/hooks/store/use-friends";
import FriendsModal from "@/components/modals/FriendsModal";
import {
  FriendshipWithBoth,
  TeamRequestWithDetails,
  TournamentRequestWithDetails,
} from "@/lib/types";
import OptionsPopover from "@/components/modals/OptionsPopover";
import { useDetailsModal, useProfileModal, useRequestModal } from "@/hooks/store/use-profile";
import UpdateProfileModal from "./UpdateProfileModal";
import EditDetailsModal from "./EditDetailsModal";
import RequestsModal from "@/components/modals/RequestsModal";
import { BentoCard } from "../../_components/cards/bento-card";
import { formatDate } from "@/utils/helper/formatDate";

const PersonalDetails = ({
  user,
  requests,
  friends,
}: {
  user: User;
  requests: {
    friendRequests: FriendshipWithBoth[];
    tournamentRequests: TournamentRequestWithDetails[];
    teamRequests: TeamRequestWithDetails[];
  };
  friends: User[];
}) => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState("statschart");

  const contentTabs = [
    {
      label: "Stats",
      id: "statschart",
      href: `/profile/${user.id}/stats`,
      icon: <MdLeaderboard className="mr-1 h-4 w-4" />,
    },
    {
      label: "Matches",
      id: "match-stats",
      href: `/profile/${user.id}/match-stats`,
      icon: <MdLeaderboard className="mr-1 h-4 w-4" />,
    },
    {
      label: "Tournaments",
      href: `/profile/${user.id}/tournament-stats`,
      id: "tournament-stats",
      icon: <MdLeaderboard className="mr-1 h-4 w-4" />,
    },
  ];

  const {
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      newUsername: user?.username || "",
      newName: user?.name || "",
      newEmail: user?.email || "",
      newPhone: user?.contact || "",
    },
  });

  const { onOpen: openFriends } = useFriendsModal();

  const {
    isOpen: isProfileOpen,
    onClose: onProfileClose,
    onOpen: onProfileOpen,
  } = useProfileModal();
  const { isOpen: isDetailOpen, onClose: onDetailClose, onOpen: onDetailOpen } = useDetailsModal();
  const {
    isOpen: isRequestOpen,
    onClose: onRequestClose,
    onOpen: onRequestOpen,
  } = useRequestModal();
  const optionsData = [
    {
      onClose: () => {},
      onOpen: onDetailOpen,
      label: "Edit Details",
    },
    {
      onClose: () => {},
      onOpen: onProfileOpen,
      label: "Update Profile",
    },
    {
      onClose: () => {},
      onOpen: onRequestOpen,
      label: "Requests",
    },
    {
      onClose: () => {},
      onOpen: () => {},
      label: "Settings",
    },
  ];

  return (
    <>
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
              <OptionsPopover data={optionsData} />
            </div>
          </div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 gap-6 px-2 md:grid-cols-12">
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
              <button onClick={() => {}} className="font-[urbanist] text-sm font-semibold">
                {friends?.length}
              </button>
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
      <UpdateProfileModal user={user} />
      <EditDetailsModal user={user} />
      <FriendsModal friends={friends} isOwnProfile />
      <RequestsModal initialRequests={requests} />
    </>
  );
};

export default PersonalDetails;
