"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { BiSolidCamera } from "react-icons/bi";
import PersonalDetails from "./_components/PersonalDetails";
import MatchStats from "./_components/MatchStats";
import TournamentStats from "./_components/TournamentStats";
import StatsChart from "./_components/StatsChart";
import { user } from "@/constants";
import { Edit2, Verified } from "lucide-react";
import Spinner from "@/components/Spinner";
import LinkTabs from "../_components/LinkTabs";
import { MdLeaderboard } from "react-icons/md";
import Tabs from "../_components/Tabs";
import { useUser } from "@/hooks/useUser";
import { useAuth, useUser as useClerkUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";

export interface ProfileFormData {
  newUsername: string;
  newName: string;
  newEmail: string;
  newPhone: string;
}

const ProfilePage = () => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState("statschart");

  const { data: user, isLoading, error } = useUser();
  console.log(user);

  return;
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

  // const {
  //   control,
  //   handleUsername,
  //   handleSubmit,
  //   submitChanges,
  //   isEdit,
  //   toggleEdit,
  //   errorMessage,
  //   loading,
  // } = useProfileForm(profile);

  // const { isEditProfile, setIsEditProfile, uploadAvatar, setFile } =
  //   useProfileAvatarUpload(profile);

  // const {
  //   reset,
  //   formState: { errors },
  // } = useForm<ProfileFormData>({
  //   defaultValues: {
  //     newUsername: profile?.username || "",
  //     newName: profile?.name || "",
  //     newEmail: profile?.email || "",
  //     newPhone: profile?.phone || "",
  //   },
  // });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="font-inter container mx-auto min-h-screen p-4">
      <div className="block">
        <div className="container-bg mb-6 grid grid-cols-1 gap-6 rounded-xl p-4 md:grid-cols-3">
          <div className="h-full rounded-xl p-6 transition-all duration-300 md:col-span-1">
            <div className="mb-6 md:hidden">
              <h3 className="font-[cal_sans] text-2xl">Profile Information</h3>
            </div>
            <div className="relative flex h-full flex-col items-center text-center">
              {/* {isEditProfile && (
            <div className="absolute top-20 z-50 flex w-full items-center justify-center">
              <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e?.target?.files && e.target.files[0]) {
                    setAvatar(e.target.files[0]);
                  }
                }}
                className="absolute h-32 w-[6.2rem] cursor-pointer opacity-0"
                type="file"
                name="image"
                accept="image/*"
              />
              <BiSolidCamera className="h-6 w-6" />

              <div className="absolute right-0 flex gap-2">
                <Button
                  variant="default"
                  className="font-urbanist w-14 cursor-pointer border-none bg-blue-500 text-xs hover:bg-blue-500/90 active:bg-blue-500/80"
                  onClick={() => {
                    setIsEditProfile(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="font-urbanist w-14 cursor-pointer text-xs"
                  onClick={() => {
                    setIsEditProfile(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )} */}
              <img
                src={
                  "https://res.cloudinary.com/irfanulmadar/image/upload/v1757846636/user_h1lqzf.svg"
                }
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
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-800 shadow-sm">
                    Friends: {user?.friends?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mb-6 h-full rounded-xl p-6 transition-all duration-300 md:col-span-2">
            <div>
              <PersonalDetails profile={user} />
            </div>
            <Button className="primary-btn absolute right-2 bottom-0">
              Edit
              <Edit2 className="h-2 w-2" />
            </Button>
          </div>
        </div>
        <div className="container-bg mb-6 rounded-xl p-4">
          <div className="mb-6 md:hidden">
            <h3 className="font-[cal_sans] text-2xl">Statistics</h3>
          </div>
          <Tabs tabs={contentTabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          {currentTab === "statschart" && <StatsChart profile={user} />}
          {currentTab === "match-stats" && <MatchStats profile={user} />}
          {currentTab === "tournament-stats" && <TournamentStats profile={user} />}
        </div>
        {/* Analytics Sections */}
      </div>
    </div>
  );
};

export default ProfilePage;
