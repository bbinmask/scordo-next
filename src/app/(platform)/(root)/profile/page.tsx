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
import { Verified } from "lucide-react";
import Spinner from "@/components/Spinner";
import Tabs from "../_components/Tabs";
import LinkTabs from "../_components/LinkTabs";

export interface ProfileFormData {
  newUsername: string;
  newName: string;
  newEmail: string;
  newPhone: string;
}

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const profile = user;

  const contentTabs = [
    {
      label: "StatsChart",
      id: "statschart",
      href: `/profile/${profile.id}/stats`,
      icon: <Verified className="h-4 w-4" />,
    },
    {
      label: "MatchStats",
      id: "matchstats",
      href: `/profile/${profile.id}/match-stats`,
      icon: <Verified className="h-4 w-4" />,
    },
    {
      label: "TournamentStats",
      href: `/profile/${profile.id}/tournament-stats`,
      id: "tournamentstats",
      icon: <Verified className="h-4 w-4" />,
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
        <div className="">
          <LinkTabs tabs={contentTabs} />
        </div>
        {/* Analytics Sections */}
        <StatsChart profile={profile} />
        <MatchStats profile={profile} />
        <TournamentStats profile={profile} />
      </div>
    </div>
  );
};

export default ProfilePage;
