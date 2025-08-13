import { formatDate } from "date-fns";
import {
  BuildingIcon,
  Edit,
  GitBranchPlusIcon,
  MapPinIcon,
  PencilIcon,
  SparklesIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Requests from "./Requests";
import { mockTeams as teams } from "@/constants";
import { useTeamJoinRequest } from "@/hooks/requests";
import Spinner from "@/components/Spinner";
import { notFound } from "next/navigation";
import TeamForm from "./UpdateTeamForm";
import { useIsTeamOwner, useTeam, useTeamRequest } from "@/hooks/useTeam";
import { user } from "@/constants";

const TeamDetails = ({ username }: { username: string }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const team = teams[0];
  const { getSingleTeam } = useTeam();
  const { isOwner } = useIsTeamOwner(team, user);

  const { joinTeam, withdrawJoinRequest, loading, isAlreadyInTeam, isAlreadyRequested } =
    useTeamRequest(team, user);

  useEffect(() => {
    getSingleTeam(username);
  }, [username]);

  return (
    <div className="font-inter relative flex min-h-screen items-center justify-center p-4">
      {!team && isLoading ? <Spinner /> : !team && !isLoading && notFound()}

      {team && !isEdit && (
        <div className="bg-light_dark relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 ease-in-out">
          {/* Banner and Header Section */}
          <div className="absolute top-2 right-2 z-50">
            {isOwner && (
              <abbr title="Edit team details">
                <button
                  className="cursor-pointer border-none shadow-xl"
                  onClick={() => setIsEdit(true)}
                >
                  <PencilIcon size={20} className="text-white" />
                </button>
              </abbr>
            )}
          </div>

          <div
            className="relative h-48 rounded-t-2xl bg-cover bg-center md:h-64"
            style={{ backgroundImage: `url(${team.banner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 flex items-end p-6">
              <img
                src={team.logo}
                alt={`${team.name} Logo`}
                className="mr-4 -mb-5 h-20 w-20 rounded-full border-4 border-blue-500 object-cover shadow-lg md:h-28 md:w-28 dark:border-blue-400"
              />
              <div>
                <h1 className="text-3xl font-extrabold text-white drop-shadow-lg text-shadow-lg md:text-5xl">
                  {team.name}
                </h1>
                <p className="mt-1 text-sm text-gray-200 md:text-base">
                  {typeof team.owner != "string" && `${team.owner?.name} - `}
                  Est. {formatDate(new Date(team.createdAt), "MM-DD-YYYY")}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="relative grid grid-cols-1 gap-8 p-6 md:grid-cols-3 md:p-8">
            {/* Requests */}

            <div className="absolute top-6 right-6 z-50">
              {isOwner ? (
                <abbr title="Team join requests">
                  <Requests team={team} setTeam={setTeam} />
                </abbr>
              ) : (
                <button
                  className={`font-urbanist cursor-pointer rounded-lg border-none px-3 py-2 font-bold ${loading && "cursor-not-allowed opacity-50"} ${isAlreadyRequested ? "bg-gray-300 text-gray-800" : "bg-prime hover:bg-hover active:bg-active text-white"}`}
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
                      withdrawRequest();
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
              <div className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Team Overview
                </h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <MapPinIcon className="mr-2 h-5 w-5 text-blue-500" />{" "}
                    {`${team.address.city}, ${team.address.state}(${team.address.country})`}
                  </li>
                  <li className="flex items-center">
                    <BuildingIcon className="mr-2 h-5 w-5 text-blue-500" />{" "}
                    {team.teamType.charAt(0).toUpperCase() + team.teamType.slice(1)} Team
                  </li>
                  <li className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5 text-blue-500" /> Captain:{" "}
                    <span className="ml-1 font-medium">{team.captain.name}</span>
                  </li>
                  <li className="flex items-center">
                    <SparklesIcon className="mr-2 h-5 w-5 text-blue-500" /> Owner:
                    <span className="ml-1 font-medium">
                      {typeof team.owner !== "string" ? team.owner.name : "null"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Recruitment Status */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
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
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Community
                </h2>
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {team.follower.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {team.following.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Description, Stats, Players, Match History */}
            <div className="space-y-8 md:col-span-2">
              {/* Description Section */}
              <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                  <span className="mr-2 text-blue-500 dark:text-blue-400">
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
                      className="lucide lucide-info"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </span>
                  About the Team
                </h2>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  {"Nothing to show here"}
                </p>
              </section>

              {/* Key Stats Section */}
              <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                  <span className="mr-2 text-green-500 dark:text-green-400">
                    <TrophyIcon />
                  </span>
                  Season Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {team.matchHistory.map((stat, index) => (
                    <div
                      key={index}
                      className="transform rounded-xl bg-gray-100 p-4 text-center shadow-sm transition-transform duration-200 hover:scale-105 dark:bg-gray-600"
                    >
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-300">{stat}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Players Section */}
              <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
                <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                  <span className="mr-2 text-purple-500 dark:text-purple-400">
                    <UsersIcon />
                  </span>
                  Roster
                </h2>
                <ul className="custom-scrollbar grid max-h-60 grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
                  {team.players.map((player, index) => (
                    <li
                      key={index}
                      className="flex items-center rounded-lg bg-gray-100 p-3 shadow-sm dark:bg-gray-600"
                    >
                      <span className="mr-2 font-semibold text-blue-600 dark:text-blue-300">
                        #{index + 1}
                      </span>
                      {typeof player !== "string" ? (
                        <Link
                          href={`/profile/${player.username}`}
                          className="text-gray-800 dark:text-gray-200"
                        >
                          {player.name}
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
                <ul className="space-y-2">
                  {team.matchHistory.map((match, index) => (
                    <li
                      key={index}
                      className={`flex items-center rounded-lg p-3 ${match.startsWith("W") ? "bg-green-50 dark:bg-green-900/40" : match.startsWith("L") ? "bg-red-50 dark:bg-red-900/40" : "bg-yellow-50 dark:bg-yellow-900/40"} text-sm font-medium text-gray-800 dark:text-gray-200`}
                    >
                      <span
                        className={`mr-3 h-3 w-3 rounded-full ${match.startsWith("W") ? "bg-green-500" : match.startsWith("L") ? "bg-red-500" : "bg-yellow-500"}`}
                      ></span>
                      {match}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}

      {isEdit && team && team && <TeamForm setEdit={setIsEdit} team={team}></TeamForm>}
    </div>
  );
};

export default TeamDetails;
