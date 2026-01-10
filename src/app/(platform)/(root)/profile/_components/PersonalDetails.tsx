"use client";

import { User } from "@/generated/prisma";
import { checkAvailability, getFullAddress } from "@/utils";
import { capitalize } from "lodash";
import { CalendarIcon, MailIcon, UserIcon, Verified } from "lucide-react";
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

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const InfoCard = ({ label, value, icon }: InfoCardProps) => (
  <div className="border-input container-bg flex items-center justify-between rounded-xl border p-5 font-[poppins]">
    <div>
      <p className="text-[13px] text-gray-600 dark:text-gray-300">
        {label.trim() === "" ? "N/A" : label}
      </p>
      <p className="text-foreground text-sm font-semibold">{value}</p>
    </div>
    <div className="bg-input rounded-lg p-2">{icon}</div>
  </div>
);

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
    <div className="relative">
      <div className="container-bg mb-6 grid grid-cols-1 gap-6 rounded-xl p-4 shadow-lg md:grid-cols-3">
        <div className="h-full rounded-xl p-6 transition-all duration-300 md:col-span-1">
          <div className="mb-6 md:hidden">
            <h3 className="font-[cal_sans] text-2xl">Profile Information</h3>
          </div>
          <div className="relative flex h-full flex-col items-center text-center">
            <img
              src={user?.avatar || "./user.svg"}
              alt="profile"
              className={`border-input borderh-36 w-36 rounded-full object-cover`}
            />
            <div className="relative mt-4 text-center">
              {user.isVerified && (
                <span className="absolute top-0 -right-5 rounded-full bg-green-700 text-white">
                  <Verified className="h-4 w-4" />
                </span>
              )}
              <p className="font-[poppins] text-base font-medium">{`@${user.username}`}</p>
              <div className="my-3 flex justify-center gap-6 text-base">
                <button
                  onClick={openFriends}
                  className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-800 shadow-sm dark:bg-gray-700 dark:text-blue-300"
                >
                  Friends: {friends?.length || 0}
                </button>
              </div>
              <div className="mt-6 max-w-md px-2 text-center">
                <div className="mx-auto mb-3 h-px w-12 bg-gray-200 dark:bg-gray-700" />
                {user.bio ? (
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
                    “{user.bio}”
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic sm:text-base dark:text-gray-500">
                    No bio added yet.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">{/* Bio */}</div>
          </div>
        </div>

        <div className="relative mb-6 h-full rounded-xl p-6 transition-all duration-300 md:col-span-2">
          <div>
            <div className="flex flex-col gap-12 md:flex-row">
              <section className="w-full">
                <div className="">
                  <h2 className="mb-6 font-[cal_sans] text-3xl">Personal Information</h2>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <InfoCard label="Name" value={user.name} icon={<UserIcon />} />
                    <InfoCard
                      label="Date of Birth"
                      value={new Date(user.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      icon={<CalendarIcon />}
                    />
                    <InfoCard
                      value={getFullAddress(user?.address)}
                      label="Address"
                      icon={<MdLocationPin />}
                    />
                    <InfoCard
                      label="Gender"
                      value={capitalize(user.gender as string)}
                      icon={
                        user.gender && user.gender.toLowerCase() === "male" ? (
                          <CgGenderMale />
                        ) : (
                          <CgGenderFemale />
                        )
                      }
                    />
                    <InfoCard label="Email" value={user.email} icon={<MailIcon />} />
                    <InfoCard
                      label="Availability"
                      value={checkAvailability(user.availability)}
                      icon={<MdOutlineEventAvailable />}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="container-bg mb-6 w-full rounded-xl p-4 shadow-lg">
        <div className="mb-6 md:hidden">
          <h3 className="font-[cal_sans] text-2xl">Statistics</h3>
        </div>
        <Tabs tabs={contentTabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {currentTab === "statschart" && <StatsChart user={user} />}
        {currentTab === "match-stats" && <MatchStats user={user} />}
        {currentTab === "tournament-stats" && <TournamentStats user={user} />}
      </div>

      <div className="absolute top-8 right-6">
        <OptionsPopover data={optionsData} />
      </div>

      <>
        <UpdateProfileModal user={user} />
        <EditDetailsModal user={user} />
        <FriendsModal friends={friends} isOwnProfile />
        <RequestsModal initialRequests={requests} />
      </>
    </div>
  );
};

export default PersonalDetails;
