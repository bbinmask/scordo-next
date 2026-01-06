"use client";

import {
  BuildingIcon,
  GitBranchPlusIcon,
  Info,
  Lock,
  MapPinIcon,
  MinusCircle,
  PencilIcon,
  SparklesIcon,
  TrophyIcon,
  UserIcon,
  UserMinus,
  UserPlus,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Requests from "../_components/Requests";
import Spinner from "@/components/Spinner";
import { notFound } from "next/navigation";
import { useIsTeamOwner, useTeamRequest } from "@/hooks/useTeam";
import { Player, Team as TeamProps, User, TeamRequest } from "@/generated/prisma";
import { formatDate } from "@/utils/helper/formatDate";
import UpdateTeamModal from "./modals/UpdateTeamModal";
import UpdateTeamImgModal from "./modals/UpdateTeamImgModal";
import { useUpdateLogoAndBanner } from "@/hooks/store/use-team";
import OptionsPopover from "./OptionsPopover";

export function TeamHeader({
  team,
  onJoinTeam,
  isOwner,
  user,
}: {
  team: TeamDetailsProp;
  onJoinTeam: () => void;
  isOwner: boolean;
  user?: User;
}) {
  const [isAlreadyInTeam, setIsAlreadyInTeam] = useState(false);
  const [hide, setHide] = useState(false);

  const { isOpen, onClose, onOpen } = useUpdateLogoAndBanner();

  const onLeaveTeam = () => {};

  useEffect(() => {
    if (user) {
      const index = team.players.findIndex((pl) => pl.user.username === user?.username);
      if (index !== -1) setIsAlreadyInTeam(true);
    }
  }, [user]);

  return (
    <>
      <div
        onMouseEnter={(e) => {
          isOwner && setHide(true);
        }}
        onMouseLeave={(e) => {
          setHide(false);
        }}
        className="container-bg relative overflow-hidden rounded-t-lg shadow-sm"
      >
        <div className="absolute top-4 right-4 z-20">
          {isOwner && hide && (
            <div title="Edit Profile details" className="">
              {/* <button
                className="cursor-pointer rounded-full bg-black/40 p-2 text-white shadow-xl transition-colors hover:bg-black/60"
                onClick={onOpen}
              >
                <PencilIcon size={20} />
              </button> */}

              <OptionsPopover />
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
              {isAlreadyInTeam ? (
                <button
                  onClick={onLeaveTeam}
                  className="flex items-center gap-1 rounded-lg bg-gray-400 px-3 py-2 font-[inter] text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                >
                  <MinusCircle size={20} className="mr-1" /> Leave
                </button>
              ) : team.isRecruiting ? (
                <button
                  onClick={onJoinTeam}
                  className="flex transform items-center rounded-lg bg-blue-600 px-4 py-2 font-[urbanist] text-sm font-semibold text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  <UserPlus size={20} className="mr-1" />
                  Join
                </button>
              ) : (
                <span className="flex items-center gap-1 rounded-lg bg-gray-400 px-3 py-1 font-[inter] text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  Private <Lock className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <UpdateTeamImgModal team={team} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

interface PlayerProps extends Player {
  user: User;
  userId: string;
}

interface TeamDetailsProp extends TeamProps {
  owner: User | string;
  captain: User | string | null;
  players: PlayerProps[];
  joinRequests: TeamRequest[];
}
// const TeamDetails = ({ team, user }: { team: TeamDetailsProp; user?: User }) => {
//   const { isOwner } = useIsTeamOwner(team, user?.id);

//   const { joinTeam, leaveTeam, withdrawJoinRequest, loading, isAlreadyInTeam, isAlreadyRequested } =
//     useTeamRequest(team, user);

//   const [isEditingDetails, setIsEditingDetails] = useState(false);

//   return (
//     <div className="container-bg relative flex min-h-screen items-center justify-center pb-6">
//       {!team && notFound()}

//       {team && (
//         <div className="w-full transform overflow-hidden transition-all duration-300 ease-in-out">
//           <TeamHeader user={user} isOwner={isOwner} team={team} onJoinTeam={() => {}} />
//           {/* Main Content */}
//           <div className="secondary-text flex justify-end px-4 py-2 font-[poppins] text-sm font-light hover:underline md:px-6">
//             <button
//               onClick={() => {
//                 setIsEditingDetails(true);
//               }}
//             >
//               Edit
//             </button>
//           </div>
//           <div className="relative grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
//             {/* Requests */}

//             <div className="absolute top-10 right-10 z-50">
//               {isOwner ? (
//                 <div title="Team join requests">
//                   <Requests data={team} />
//                 </div>
//               ) : (
//                 <button
//                   className={`cursor-pointer rounded-lg border-none px-3 py-2 font-bold ${loading && "cursor-not-allowed opacity-50"} ${isAlreadyRequested ? "bg-gray-300 text-gray-800" : "nline-flex items-center rounded-full border-none bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-800 dark:text-green-200"}`}
//                   onClick={() => {
//                     const confirm = window.confirm(
//                       isAlreadyInTeam
//                         ? "Are you sure you want to leave this team?"
//                         : isAlreadyRequested
//                           ? "Do you want to withdraw your join request?"
//                           : "Do you want to send a join request to this team?"
//                     );

//                     if (!confirm) return;

//                     if (isAlreadyInTeam) {
//                       leaveTeam();
//                     } else if (isAlreadyRequested) {
//                       withdrawJoinRequest();
//                     } else {
//                       joinTeam();
//                     }
//                   }}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <Spinner />
//                   ) : isAlreadyRequested ? (
//                     "sent"
//                   ) : isAlreadyInTeam ? (
//                     "Joined"
//                   ) : team.isRecruiting ? (
//                     "+ Join"
//                   ) : (
//                     "Full"
//                   )}
//                 </button>
//               )}
//             </div>

//             {/* Left Column - General Info & Recruitment */}
//             <div className="space-y-6 md:col-span-1">
//               {/* Quick Info */}
//               <div className="rounded-xl bg-gray-50 p-5 font-[poppins] shadow-sm dark:bg-gray-700">
//                 <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
//                   Team Overview
//                 </h2>
//                 <ul className="space-y-2 text-gray-700 dark:text-gray-300">
//                   <li className="flex items-center">
//                     <MapPinIcon className="mr-2 h-5 w-5 text-blue-500" />
//                     {!team.address
//                       ? "No address found."
//                       : `${team.address.city}, ${team.address.state}(${team.address.country})`}
//                   </li>
//                   <li className="flex items-center">
//                     <BuildingIcon className="mr-2 h-5 w-5 text-blue-500" /> Type:{" "}
//                     {team.type.charAt(0).toUpperCase() + team.type.slice(1)}
//                   </li>
//                   <li className="flex items-center">
//                     <UserIcon className="mr-2 h-5 w-5 text-blue-500" /> Captain:{" "}
//                     {team.captain && typeof team.captain !== "string" && (
//                       <Link
//                         href={`/users/${team.captain.username}`}
//                         className="ml-1 font-medium hover:underline"
//                       >
//                         {team.captain.name}
//                       </Link>
//                     )}
//                   </li>
//                   <li className="flex items-center">
//                     <SparklesIcon className="mr-2 h-5 w-5 text-blue-500" /> Owner:
//                     {team.owner && typeof team.owner !== "string" && (
//                       <Link
//                         href={`/users/${team.owner.username}`}
//                         className="ml-1 font-medium hover:underline"
//                       >
//                         {team.owner.name}
//                       </Link>
//                     )}
//                   </li>
//                 </ul>
//               </div>

//               {/* Recruitment Status */}
//               <div className="flex items-center justify-between rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
//                 <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//                   <GitBranchPlusIcon className="mr-2 h-6 w-6 text-blue-500" /> Recruitment Status
//                 </h2>
//                 {team.isRecruiting ? (
//                   <span className="inline-flex items-center rounded-full border-none bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-800 dark:text-green-200">
//                     <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
//                     Open
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 dark:bg-red-800 dark:text-red-200">
//                     Closed
//                   </span>
//                 )}
//               </div>

//               {/* Followers / Following */}
//               <div className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
//                 <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
//                   Community
//                 </h2>
//                 <div className="flex justify-around text-center">
//                   <div>
//                     <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
//                       12000
//                       {/* players.length */}
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column  */}
//             <div className="space-y-8 md:col-span-2">
//               {/* Description Section */}
//               <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
//                 <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
//                   <span className="mr-2 text-blue-500 dark:text-blue-400">
//                     <Info />
//                   </span>
//                   About the Team
//                 </h2>
//                 <p className="leading-relaxed text-gray-700 dark:text-gray-300">
//                   {"Nothing to show here"}
//                 </p>
//               </section>

//               {/* Key Stats Section */}
//               <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
//                 <Link
//                   href={`/teams/${team.abbreviation}/stats`}
//                   className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white"
//                 >
//                   <span className="mr-2 text-green-500 dark:text-green-400">
//                     <TrophyIcon />
//                   </span>
//                   Season Statistics
//                 </Link>
//                 {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
//                   {team.matches.map((stat, i) => (
//                     <div
//                       key={i}
//                       className="transform rounded-xl bg-gray-100 p-4 text-center shadow-sm transition-transform duration-200 hover:scale-105 dark:bg-gray-600"
//                     >
//                       <p className="text-xl font-bold text-blue-600 dark:text-blue-300">{stat}</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">{stat}</p>
//                     </div>
//                   ))}
//                 </div> */}
//               </section>

//               {/* Players Section */}
//               <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
//                 <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
//                   <span className="mr-2 text-purple-500 dark:text-purple-400">
//                     <UsersIcon />
//                   </span>
//                   Members
//                 </h2>
//                 <ul className="custom-scrollbar grid max-h-60 grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
//                   {team.players.map((player, i) => (
//                     <li
//                       key={i}
//                       className="flex items-center rounded-lg bg-gray-100 p-3 shadow-sm dark:bg-gray-600"
//                     >
//                       <span className="mr-2 font-semibold text-blue-600 dark:text-blue-300">
//                         {i + 1}•
//                       </span>
//                       {typeof player !== "string" ? (
//                         <Link
//                           href={`/users/${player.user.username}`}
//                           className="text-gray-800 hover:underline dark:text-gray-200"
//                         >
//                           {player.user.name}
//                         </Link>
//                       ) : (
//                         <span className="text-gray-800 dark:text-gray-200">null</span>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </section>

//               {/* Match History Section */}
//               <section className="rounded-xl bg-gray-50 p-5 shadow-sm dark:bg-gray-700">
//                 <h2 className="mb-3 flex items-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
//                   <span className="mr-2 text-orange-500 dark:text-orange-400">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="lucide lucide-calendar-check"
//                     >
//                       <path d="M8 2v4" />
//                       <path d="M16 2v4" />
//                       <rect width="18" height="18" x="3" y="4" rx="2" />
//                       <path d="M3 10h18" />
//                       <path d="m9 16 2 2 4-4" />
//                     </svg>
//                   </span>
//                   Recent Matches
//                 </h2>
//                 {/* <ul className="space-y-2">
//                   {team.matchHistory.map((match, i) => (
//                     <li
//                       key={i}
//                       className={`flex items-center rounded-lg p-3 ${match.startsWith("W") ? "bg-green-50 dark:bg-green-900/40" : match.startsWith("L") ? "bg-red-50 dark:bg-red-900/40" : "bg-yellow-50 dark:bg-yellow-900/40"} text-sm font-medium text-gray-800 dark:text-gray-200`}
//                     >
//                       <span
//                         className={`mr-3 h-3 w-3 rounded-full ${match.startsWith("W") ? "bg-green-500" : match.startsWith("L") ? "bg-red-500" : "bg-yellow-500"}`}
//                       ></span>
//                       {match}
//                     </li>
//                   ))}
//                 </ul> */}
//               </section>
//             </div>
//           </div>
//         </div>
//       )}
//       <UpdateTeamModal
//         team={team}
//         isOpen={isEditingDetails}
//         isOwner={isOwner}
//         setIsOpen={setIsEditingDetails}
//       />
//     </div>
//   );
// };

// export default TeamDetails;
