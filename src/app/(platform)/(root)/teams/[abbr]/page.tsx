"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import Spinner, { DefaultLoader } from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { useIsTeamOwner } from "@/hooks/useTeam";
import Link from "next/link";
import {
  BuildingIcon,
  Cross,
  GitBranchPlusIcon,
  History,
  Info,
  Lock,
  MapPinIcon,
  MinusCircle,
  SparklesIcon,
  TrophyIcon,
  UserIcon,
  UserPlus,
  UsersIcon,
} from "lucide-react";
import { Player as IPlayer, Team as ITeam, User } from "@/generated/prisma";
import { useUpdateTeam } from "@/hooks/store/use-team";
import OptionsPopover from "../_components/OptionsPopover";
import { formatDate } from "@/utils/helper/formatDate";
import { TeamRequestWithDetails } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { sendTeamRequest } from "@/actions/team-actions";
import { toast } from "sonner";

interface PlayerProps extends IPlayer {
  user: User;
  userId: string;
}

interface TeamDetailsProp extends ITeam {
  owner: User | string;
  captain: User | string | null;
  players: PlayerProps[];
  // joinRequests: TeamRequest[];
}

const TeamIdPage = () => {
  const params: { abbr: string } = useParams();

  const {
    data: team,
    isLoading,
    error,
  } = useQuery<TeamDetailsProp>({
    queryKey: ["team", params.abbr],
    queryFn: async () => {
      const { data } = await axios.get(`/api/teams/${params.abbr}`);

      if (data.success) return data.data;
    },
  });

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/api/me");

      return res.data;
    },
  });

  const { data: requests, isLoading: reqLoading } = useQuery<TeamRequestWithDetails>({
    queryKey: ["team-requests", user?.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/teams/${params.abbr}/requests`);

      return data.data;
    },
  });

  const { isOwner } = useIsTeamOwner(team as any, user?.id);

  return (
    <div className="w-full pt-4">
      {!team && !isLoading && notFound()}
      {team ? (
        <div className="container-bg relative flex rounded-lg border pb-6">
          <div className="w-full transform overflow-hidden transition-all duration-300 ease-in-out">
            <TeamHeader user={user} isOwner={isOwner} team={team as any} />
            {/* Main Content */}

            <div className="relative mt-4 grid grid-cols-1 gap-8 px-4 lg:grid-cols-3 lg:px-6">
              {/* Left Column - General Info & Recruitment */}
              <div className="space-y-6 lg:col-span-1">
                {/* Quick Info */}
                <div className="rounded-xl bg-gray-50 p-5 font-[poppins] shadow-sm dark:bg-gray-700">
                  <h2 className="mb-3 font-[poppins] text-lg font-semibold text-gray-900 dark:text-white">
                    Team Overview
                  </h2>
                  <ul className="space-y-2 font-[urbanist] font-semibold text-gray-700 dark:text-gray-300">
                    <li className="flex items-center">
                      <MapPinIcon className="mr-2 h-5 w-5 text-blue-500" />
                      {!team.address
                        ? "No address found."
                        : `${team.address.city}, ${team.address.state}(${team.address.country})`}
                    </li>
                    <li className="flex items-center">
                      <BuildingIcon className="mr-2 h-5 w-5 text-blue-500" /> Type:{" "}
                      {team.type.charAt(0).toUpperCase() + team.type.slice(1)}
                    </li>
                    <li className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5 text-blue-500" /> Captain:{" "}
                      {team.captain && typeof team.captain !== "string" && (
                        <Link
                          href={`/users/${team.captain.username}`}
                          className="ml-1 font-medium hover:underline"
                        >
                          {team.captain.name}
                        </Link>
                      )}
                    </li>
                    <li className="flex items-center">
                      <SparklesIcon className="mr-2 h-5 w-5 text-blue-500" /> Owner:
                      {team.owner && typeof team.owner !== "string" && (
                        <Link
                          href={`/users/${team.owner.username}`}
                          className="ml-1 font-medium hover:underline"
                        >
                          {team.owner.name}
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>

                {/* Recruitment Status */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                  <h2 className="flex items-center font-[poppins] text-lg font-semibold text-gray-900 dark:text-white">
                    <GitBranchPlusIcon className="mr-2 h-6 w-6 text-blue-500" /> Recruitment Status
                  </h2>
                  {team.isRecruiting ? (
                    <span className="inline-flex items-center rounded-full border-none bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-800 dark:text-green-200">
                      <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                      Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 dark:bg-red-800 dark:text-red-200">
                      Closed
                    </span>
                  )}
                </div>

                {/* Followers / Following */}
                <div className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                  <h2 className="mb-3 font-[poppins] text-lg font-semibold text-gray-900 dark:text-white">
                    Community
                  </h2>
                  <div className="center grid font-[urbanist]">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      12000
                      {/* players.length */}
                    </p>
                    <p className="secondary-text text-sm font-semibold">Followers</p>
                  </div>
                </div>
              </div>

              {/* Right Column  */}
              <div className="space-y-8 lg:col-span-2">
                {/* Description Section */}
                <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                  <h2 className="mb-3 flex items-center font-[poppins] text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
                    <span className="mr-2 text-blue-500 dark:text-blue-400">
                      <Info />
                    </span>
                    About the Team
                  </h2>
                  <p className="secondary-text font-[urbanist] leading-relaxed">
                    {"Nothing to show here"}
                  </p>
                </section>

                {/* Key Stats Section */}
                <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                  <Link
                    href={`/teams/${team.abbreviation}/stats`}
                    className="mb-3 flex items-center font-[poppins] text-xl font-bold text-gray-900 lg:text-2xl dark:text-white"
                  >
                    <span className="mr-2 text-green-500 dark:text-green-400">
                      <TrophyIcon />
                    </span>
                    Season Statistics
                  </Link>
                  {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {team.matches.map((stat, i) => (
                    <div
                      key={i}
                      className="transform rounded-xl bg-gray-100 p-4 text-center shadow-sm transition-transform duration-200 hover:scale-105 dark:bg-gray-600"
                    >
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-300">{stat}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat}</p>
                    </div>
                  ))}
                </div> */}
                </section>

                {/* Players Section */}
                <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                  <h2 className="mb-3 flex items-center font-[poppins] text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
                    <span className="mr-2 text-purple-500 dark:text-purple-400">
                      <UsersIcon />
                    </span>
                    Members
                  </h2>
                  <ul className="custom-scrollbar grid max-h-60 grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
                    {team.players.map((player, i) => (
                      <li
                        key={i}
                        className="flex items-center rounded-lg p-3 font-semibold shadow-sm"
                      >
                        <span className="mr-2 text-blue-600 dark:text-blue-300">{i + 1}•</span>
                        {typeof player !== "string" ? (
                          <Link
                            href={`/users/${player.user.username}`}
                            className="font-[urbanist] font-semibold text-blue-600 hover:underline dark:text-blue-300"
                          >
                            {player.user.name}
                          </Link>
                        ) : (
                          <span className="text-gray-800 dark:text-gray-200">null</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Match History Section */}
                <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                  <h2 className="mb-3 flex items-center font-[poppins] text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
                    <History color="orange" className="mr-1" />
                    Recent Matches
                  </h2>
                  <p className="secondary-text py-2 text-center font-[urbanist] font-semibold">
                    No data to show here
                  </p>
                  {/* <ul className="space-y-2">
                  {team.matchHistory.map((match, i) => (
                    <li
                      key={i}
                      className={`flex items-center rounded-lg p-3 ${match.startsWith("W") ? "bg-green-50 dark:bg-green-900/40" : match.startsWith("L") ? "bg-red-50 dark:bg-red-900/40" : "bg-yellow-50 dark:bg-yellow-900/40"} text-sm font-medium text-gray-800 dark:text-gray-200`}
                    >
                      <span
                        className={`mr-3 h-3 w-3 rounded-full ${match.startsWith("W") ? "bg-green-500" : match.startsWith("L") ? "bg-red-500" : "bg-yellow-500"}`}
                      ></span>
                      {match}
                    </li>
                  ))}
                </ul> */}
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <DefaultLoader />
      ) : (
        <NotFoundParagraph description={error?.message || "Team not found!"} />
      )}
    </div>
  );
};

export function TeamHeader({
  team,
  isOwner,
  user,
}: {
  team: TeamDetailsProp;
  isOwner: boolean;
  user?: User;
}) {
  const [conditionState, setConditionState] = useState({
    alreadyInTeam: false,
    alreadySent: false,
  });

  const { execute, isLoading } = useAction(sendTeamRequest, {
    onSuccess: (data) => {
      setConditionState((prev) => ({ ...prev, alreadySent: true }));
      toast.success("Request sent!");
    },
    onError: (err) => {
      setConditionState((prev) => ({ ...prev, alreadySent: false }));
      toast.error(err);
    },
  });

  const { data: request } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const { data } = await axios.get(`/api/me/teams/${team.abbreviation}/request/status`);

      return data.data;
    },
  });

  const handleLeaveTeam = () => {};

  const handleJoinTeam = () => {
    if (conditionState.alreadySent || conditionState.alreadyInTeam) return;
    execute({ teamId: team.id });
  };

  useEffect(() => {
    if (user) {
      const index = team.players.findIndex((pl) => pl.user.username === user?.username);
      if (index !== -1) setConditionState((prev) => ({ ...prev, alreadyInTeam: true }));
    }
  }, [user]);

  return (
    <>
      <div className="container-bg relative overflow-hidden rounded-t-lg shadow-sm">
        <div className="absolute top-4 right-4 z-20">
          {isOwner && (
            <div title="Edit Profile details" className="">
              <OptionsPopover team={team} />
            </div>
          )}
        </div>
        {/* Banner */}
        <div className="relative h-40 md:h-44">
          {team.banner && (
            <img
              src={team?.banner || undefined}
              alt={`${team.name} banner`}
              className="h-full w-full object-cover"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/1200x400/667EEA/FFFFFF?text=Team+Banner")
              }
            />
          )}
        </div>

        {/* Header */}
        <div className="p-6">
          <div className="relative z-10 -mt-20 flex flex-col items-center sm:-mt-24 sm:flex-row sm:items-end">
            <img
              src={team?.logo || "/team.svg"}
              alt={`${team.name} logo`}
              className="h-32 w-32 rounded-full border-4 border-white shadow-md md:h-40 md:w-40"
              onError={(e) =>
                (e.currentTarget.src = "https://placehold.co/150x150/667EEA/FFFFFF?text=Logo")
              }
            />

            {/* Team Name & Actions */}
            <div className="mt-4 flex-1 text-center sm:mt-0 sm:ml-6 sm:text-left">
              <h1 className="primary-text truncate font-[cal_sans] text-3xl font-bold md:text-4xl">
                {team.name}
              </h1>
              <p className="secondary-text font-[urbanist] text-lg font-medium">
                @{team.abbreviation}
              </p>
              <p className="secondary-text font-[inter] text-xs">{`Established - ${formatDate(new Date(team.createdAt))}`}</p>
            </div>

            {/* Join Button */}
            <div className="mt-4 sm:mt-0">
              {conditionState.alreadyInTeam ? (
                <button
                  onClick={handleLeaveTeam}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-400 px-3 py-2 font-[inter] text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                >
                  <MinusCircle size={20} className="mr-1" /> Leave
                </button>
              ) : conditionState.alreadySent ? (
                <button
                  onClick={() => {}}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-400 px-3 py-2 font-[inter] text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                >
                  Cancel
                </button>
              ) : team.isRecruiting ? (
                <button
                  disabled={isLoading}
                  onClick={handleJoinTeam}
                  className="primary-btn flex transform cursor-pointer items-center rounded-3xl px-4 py-2 font-[urbanist] text-sm hover:opacity-80 active:scale-95"
                >
                  {isLoading ? <Spinner /> : "Join"}
                </button>
              ) : (
                <span className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-400 px-3 py-1 font-[inter] text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  Private <Lock className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamIdPage;
