"use client";

import React, { useState } from "react";
import TeamDetails, { TeamHeader } from "../_components/TeamDetails";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { currentUser } from "@/lib/currentUser";
import { useIsTeamOwner, useTeamRequest } from "@/hooks/useTeam";
import UpdateTeamModal from "../_components/modals/UpdateTeamModal";
import Link from "next/link";
import {
  BuildingIcon,
  GitBranchPlusIcon,
  Info,
  MapPinIcon,
  SparklesIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Requests from "../_components/Requests";
import { Player as IPlayer, Team as ITeam, User, TeamRequest } from "@/generated/prisma";

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

  const { isOwner } = useIsTeamOwner(team as any, user?.id);

  const { joinTeam, leaveTeam, withdrawJoinRequest, loading, isAlreadyInTeam, isAlreadyRequested } =
    useTeamRequest(team as any, user);

  const [isEditingDetails, setIsEditingDetails] = useState(false);

  console.log(team);

  return (
    <div className="min-h-screen w-full pt-4">
      {team ? (
        <div className="container-bg relative flex rounded-2xl border pb-6">
          {!team && notFound()}

          {team && (
            <div className="w-full transform overflow-hidden transition-all duration-300 ease-in-out">
              <TeamHeader user={user} isOwner={isOwner} team={team as any} onJoinTeam={() => {}} />
              {/* Main Content */}
              <div className="secondary-text flex justify-end px-4 py-2 font-[poppins] text-sm font-light hover:underline md:px-6">
                <button
                  onClick={() => {
                    setIsEditingDetails(true);
                  }}
                >
                  Edit
                </button>
              </div>
              <div className="relative grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
                {/* Requests */}

                <div className="absolute top-10 right-10 z-50">
                  {isOwner ? (
                    <div title="Team join requests">
                      <Requests data={team} />
                    </div>
                  ) : (
                    <button
                      className={`cursor-pointer rounded-lg border-none px-3 py-2 font-bold ${loading && "cursor-not-allowed opacity-50"} ${isAlreadyRequested ? "bg-gray-300 text-gray-800" : "nline-flex items-center rounded-full border-none bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-800 dark:text-green-200"}`}
                      onClick={() => {
                        const confirm = window.confirm(
                          isAlreadyInTeam
                            ? "Are you sure you want to leave this team?"
                            : isAlreadyRequested
                              ? "Do you want to withdraw your join request?"
                              : "Do you want to send a join request to this team?"
                        );

                        if (!confirm) return;

                        if (isAlreadyInTeam) {
                          leaveTeam();
                        } else if (isAlreadyRequested) {
                          withdrawJoinRequest();
                        } else {
                          joinTeam();
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner />
                      ) : isAlreadyRequested ? (
                        "sent"
                      ) : isAlreadyInTeam ? (
                        "Joined"
                      ) : team.isRecruiting ? (
                        "+ Join"
                      ) : (
                        "Full"
                      )}
                    </button>
                  )}
                </div>

                {/* Left Column - General Info & Recruitment */}
                <div className="space-y-6 md:col-span-1">
                  {/* Quick Info */}
                  <div className="rounded-xl bg-gray-50 p-5 font-[poppins] shadow-sm dark:bg-gray-700">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Team Overview
                    </h2>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
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
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                      <GitBranchPlusIcon className="mr-2 h-6 w-6 text-blue-500" /> Recruitment
                      Status
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
                    <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Community
                    </h2>
                    <div className="flex justify-around text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                          12000
                          {/* players.length */}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column  */}
                <div className="space-y-8 md:col-span-2">
                  {/* Description Section */}
                  <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                    <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                      <span className="mr-2 text-blue-500 dark:text-blue-400">
                        <Info />
                      </span>
                      About the Team
                    </h2>
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                      {"Nothing to show here"}
                    </p>
                  </section>

                  {/* Key Stats Section */}
                  <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                    <Link
                      href={`/teams/${team.abbreviation}/stats`}
                      className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white"
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
                    <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                      <span className="mr-2 text-purple-500 dark:text-purple-400">
                        <UsersIcon />
                      </span>
                      Members
                    </h2>
                    <ul className="custom-scrollbar grid max-h-60 grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
                      {team.players.map((player, i) => (
                        <li
                          key={i}
                          className="flex items-center rounded-lg bg-gray-100 p-3 shadow-sm dark:bg-gray-600"
                        >
                          <span className="mr-2 font-semibold text-blue-600 dark:text-blue-300">
                            {i + 1}•
                          </span>
                          {typeof player !== "string" ? (
                            <Link
                              href={`/users/${player.user.username}`}
                              className="text-gray-800 hover:underline dark:text-gray-200"
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
                    <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                      <span className="mr-2 text-orange-500 dark:text-orange-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-calendar-check"
                        >
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <path d="M3 10h18" />
                          <path d="m9 16 2 2 4-4" />
                        </svg>
                      </span>
                      Recent Matches
                    </h2>
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
          )}
          <UpdateTeamModal
            team={team}
            isOpen={isEditingDetails}
            isOwner={isOwner}
            setIsOpen={setIsEditingDetails}
          />
        </div>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <NotFoundParagraph description={error?.message || "Team not found!"} />
      )}
    </div>
  );
};

export default TeamIdPage;
