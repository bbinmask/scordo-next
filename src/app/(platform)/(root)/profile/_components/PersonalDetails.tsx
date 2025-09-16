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

const PersonalDetails = ({ user }: { user: User }) => {
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

  return (
    <>
      <div className="container-bg mb-6 grid grid-cols-1 gap-6 rounded-xl p-4 shadow-lg md:grid-cols-3">
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

            <div className="mt-6">{/* Bio */}</div>
          </div>
        </div>

        <div className="relative mb-6 h-full rounded-xl p-6 transition-all duration-300 md:col-span-2">
          <div>
            <div className="flex flex-col gap-12 md:flex-row">
              <section className="w-full">
                <div className="">
                  <h2 className="mb-2 font-[cal_sans] text-3xl">Personal information</h2>
                  <p className="mb-10 font-[urbanist] text-sm text-gray-500">
                    Manage your personal information, including phone numers and email adress where
                    you can be contacted
                  </p>

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
    </>
  );
};

export default PersonalDetails;
