"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MdEdit } from "react-icons/md";
import { BiSolidCamera } from "react-icons/bi";
import ProfileForm from "./_components/ProfileForm";
import ProfileDetails from "./_components/ProfileDetails";
import MatchStats from "./_components/MatchStats";
import TournamentStats from "./_components/TournamentStats";
import StatsChart from "./_components/StatsChart";
import User from "@/types/user.props";
import { user } from "@/constants";

const Spinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900"></div>
);

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
        <div className="container-bg border-input relative mb-6 grid w-full gap-6 rounded-xl border px-3 md:grid-cols-3">
          {/* Profile Picture */}
          <div className="h-full p-6 transition-all duration-300 md:col-span-1">
            <div className="mb-6">
              <h3 className="font-[cal_sans] text-2xl">Profile Information</h3>
            </div>
            <div className="relative flex flex-col items-center text-center">
              {isEditProfile && (
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
              )}
              <img
                src={"https://bootdey.com/img/Content/avatar/avatar7.png"}
                onClick={() => {
                  // if (!isOwner) return;
                  setIsEditProfile(true);
                }}
                alt="profile"
                className={`border-input rounded-full border ${isEditProfile && "opacity-25"} h-36 w-36 object-cover`}
              />
              <div className="mt-4 text-center">
                <p className="font-[poppins] text-base font-medium">{`@${profile.username}`}</p>
                <div className="my-3 flex justify-center gap-6 text-base">
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-800 shadow-sm">
                    Friends: {profile?.friends?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Details and Edit Form */}
          <div className="mb-6 h-full p-6 transition-all duration-300 md:col-span-2">
            <div>
              <ProfileDetails profile={profile} />
              {/* {isEdit ? (
                <ProfileForm
                  loading={loading}
                  errorMessage={errorMessage}
                  control={control}
                  onUsername={handleUsername}
                  handleSubmit={handleSubmit}
                  submitChanges={submitChanges}
                  profile={profile}
                />
              ) : (
                <ProfileDetails profile={profile} />
              )} */}
              {/* {!isEdit && isOwner && (
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={toggleEdit}
                    variant={"default"}
                    className="border-none bg-gradient-to-r from-gray-400 to-gray-500 px-6 py-3 text-stone-800 shadow-md hover:from-gray-500 hover:to-gray-600 focus:ring-gray-400"
                  >
                    <MdEdit className="mr-1 text-xl" /> Edit
                  </Button>
                </div>
              )} */}
            </div>
          </div>
        </div>

        <div className="grid h-full w-full gap-2 px-3 md:grid-cols-3">
          {/* Analytics Sections */}
          <StatsChart profile={profile} />
          <MatchStats profile={profile} />
          <TournamentStats profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
