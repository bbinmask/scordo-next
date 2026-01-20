"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import Spinner, { DefaultLoader } from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { useIsTeamOwner } from "@/hooks/useTeam";
import Link from "next/link";
import {
  ArrowUpRight,
  Building,
  BuildingIcon,
  Cross,
  Flag,
  GitBranchPlusIcon,
  History,
  Info,
  Lock,
  LucideProps,
  MapPin,
  MapPinIcon,
  MinusCircle,
  MoreVertical,
  Shield,
  SparklesIcon,
  Trophy,
  TrophyIcon,
  UserIcon,
  UserPlus,
  Users,
  UsersIcon,
  Zap,
} from "lucide-react";
import { Player as IPlayer, Team as ITeam, User } from "@/generated/prisma";
import { usePlayerModal, useUpdateTeam } from "@/hooks/store/use-team";
import OptionsPopover from "../_components/OptionsPopover";
import { formatDate } from "@/utils/helper/formatDate";
import { PlayerWithUser, TeamRequestWithDetails } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { sendTeamRequest } from "@/actions/team-actions";
import { toast } from "sonner";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { Separator } from "@/components/ui/separator";
import PlayerModal from "./_components/PlayerModal";

interface PlayerProps extends IPlayer {
  user: User;
  userId: string;
}

interface TealgetailsProp extends ITeam {
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
  } = useQuery<TealgetailsProp>({
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

  const { data: sentRequest } = useQuery({
    queryKey: ["sent-request", params.abbr],
    queryFn: async () => {
      const { data } = await axios.get(`/api/me/teams/${params.abbr}/request/status`);

      return data.data;
    },
  });

  const [alreadyInTeam, setAlreadyInTeam] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithUser | null>(null);

  const hasSentRequest = Boolean(sentRequest);

  const { isOwner, isCaptain } = useIsTeamOwner(team as any, user?.id);
  const { onOpen: onPlayerOpen } = usePlayerModal();

  useEffect(() => {
    if (user) {
      const index = team?.players.findIndex((pl) => pl.user.username === user?.username);
      if (index !== -1) setAlreadyInTeam(true);
    }
  }, [user, team]);

  return (
    <div className="w-full pt-4">
      {!team && !isLoading && notFound()}
      {team ? (
        <div className="container-bg relative flex rounded-lg border pb-6">
          <div className="w-full transform overflow-hidden transition-all duration-300 ease-in-out">
            <TeamHeader
              alreadyInTeam={alreadyInTeam}
              setAlreadyInTeam={setAlreadyInTeam}
              alreadySent={hasSentRequest}
              user={user}
              isOwner={isOwner}
              team={team as any}
            />
            {/* Main Content */}

            <div className="relative mt-4 grid grid-cols-1 gap-8 px-4 pb-8 lg:mt-12 lg:grid-cols-3 lg:px-6">
              {/* Left Column - General Info & Recruitment */}
              <div className="space-y-6 lg:col-span-1">
                {/* Quick Info */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <StatCard
                      label="Location"
                      value={`${team.address?.city}, ${team.address?.state}`}
                      icon={MapPin}
                      color="emerald"
                    />
                    <StatCard label="Team Type" value={team.type} icon={Building} color="indigo" />
                    <StatCard
                      label="Organization Status"
                      value={team.isRecruiting ? "Open" : "Invite Only"}
                      icon={Shield}
                      color="purple"
                    />
                  </div>

                  {team.isRecruiting && !alreadyInTeam && !hasSentRequest && (
                    <div className="group relative overflow-hidden rounded-[2rem] bg-green-700 p-8 text-white">
                      <Zap className="absolute top-2 right-2 h-32 w-32 -rotate-12 text-white/5 transition-transform group-hover:scale-110" />
                      <h3 className="mb-2 text-2xl font-black tracking-tighter uppercase italic">
                        Recruitment Active
                      </h3>
                      <p className="font-[urbanist] text-sm leading-snug font-medium text-slate-300">
                        We are currently looking for Grandmaster level players for our upcoming
                        matches.
                      </p>
                      <button className="mt-6 w-full cursor-pointer rounded-xl bg-white py-3 font-[poppins] text-xs font-bold text-slate-800 uppercase transition-all hover:shadow-xl">
                        Apply Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Followers / Following */}
                <div className="hover-card rounded-xl p-5">
                  <h2 className="mb-3 font-[poppins] text-lg font-semibold text-gray-900 dark:text-white">
                    Community
                  </h2>
                  <div className="center grid font-[urbanist]">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-300">
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
                <section className="hover-card rounded-xl p-5">
                  <h2 className="mb-3 flex items-center font-[poppins] text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
                    <span className="mr-2 text-green-600">
                      <Info />
                    </span>
                    About the Team
                  </h2>
                  <p className="secondary-text font-[urbanist] leading-relaxed">
                    {"Nothing to show here"}
                  </p>
                </section>

                {/* Key Stats Section */}
                <section className="hover-card rounded-xl p-5">
                  <Link
                    href={`/teams/${team.abbreviation}/stats`}
                    className="mb-3 flex items-center font-[poppins] text-xl font-bold text-gray-900 lg:text-2xl dark:text-white"
                  >
                    <span className="mr-2 text-green-500 dark:text-green-400">
                      <TrophyIcon />
                    </span>
                    Season Statistics
                  </Link>
                </section>

                {/* Players Section */}

                <section className="hover-card rounded-2xl py-8">
                  <div className="mb-6 flex items-center justify-between px-8">
                    <h2 className="flex items-center gap-3 text-2xl font-black tracking-tighter uppercase italic">
                      <Users className="text-purple-500" /> Players
                    </h2>
                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500 uppercase dark:bg-white/5">
                      {team.players.length} Total
                    </span>
                  </div>
                  <Separator />
                  <div className="grid max-h-60 grid-cols-1 gap-4 overflow-auto overflow-x-hidden p-4 sm:grid-cols-2">
                    {team.players.map((p, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedPlayer(p);

                          onPlayerOpen();
                        }}
                        className="group border-input flex items-center justify-between rounded-2xl border bg-slate-200 p-4 transition-all hover:border-green-500/50 dark:bg-slate-900"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-black text-green-600 dark:bg-indigo-900/30`}
                          >
                            {p.user?.avatar ? (
                              <img src={p.user.avatar} className="h-full w-full rounded-xl" />
                            ) : (
                              p.user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-bold tracking-tighter uppercase transition-colors group-hover:text-green-500">
                              {`${p.user.name}`}
                            </p>
                            <p className="text-[10px] font-black tracking-widest text-slate-400 italic">
                              {`${p.user.username}`}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 transition-all group-hover:text-green-500" />
                      </div>
                    ))}
                  </div>
                </section>
                {/* Match History Section */}
                <section className="hover-card rounded-xl p-5">
                  <h2 className="mb-3 flex items-center font-[poppins] text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
                    <History color="orange" className="mr-1" />
                    Recent Matches
                  </h2>
                  <p className="secondary-text py-2 text-center font-[urbanist] font-semibold">
                    No data to show here
                  </p>
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
      <PlayerModal isOwner={isOwner} isCaptain={isCaptain} player={selectedPlayer} />
    </div>
  );
};

interface TeamHeaderProps {
  team: TealgetailsProp;
  isOwner: boolean;
  user?: User;
  alreadyInTeam: boolean;
  setAlreadyInTeam: Dispatch<SetStateAction<boolean>>;
  alreadySent: boolean;
}

const TeamHeader = ({
  team,
  isOwner,
  user,
  alreadySent,
  alreadyInTeam,
  setAlreadyInTeam,
}: TeamHeaderProps) => {
  const isAlreadySent = alreadySent;

  const queryClient = useQueryClient();

  const { execute: executeSentRequest, isLoading } = useAction(sendTeamRequest, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["sent-request", team.abbreviation],
      });
      toast.success("Request sent!");
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const { confirmModalState, openConfirmModal, closeConfirmModal } = useConfirmModal();

  const handleLeaveTeam = () => {
    alert("Left");
  };

  const handleWidthdrawRequest = () => {
    alert("Request widthdrawn");
  };

  const handleJoinTeam = () => {
    if (isAlreadySent || alreadyInTeam) return;
    executeSentRequest({ teamId: team.id });
  };

  return (
    <header className="relative w-full">
      {/* --- DYNAMIC HERO BANNER SECTION --- */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg lg:h-96">
        {/* Layer 1: Actual Image or Animated Fallback */}
        {team.banner ? (
          <img src={team.banner} alt="Banner" className="h-full w-full rounded-t-lg object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950">
            <div className="absolute inset-0 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            {/* Dynamic Mesh Blobs */}
            <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-500 opacity-30 blur-[120px]" />
            <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500 opacity-30 blur-[120px]" />
          </div>
        )}

        {/* Layer 2: Scrims & Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-50 dark:to-[#020617]" />

        {isOwner && (
          <div className="absolute top-6 right-6 z-50">
            <OptionsPopover team={team} />
          </div>
        )}
      </div>

      {/* --- MAIN HEADER CONTENT --- */}
      <div className="relative z-10 mx-auto -mt-24 max-w-7xl px-6 lg:-mt-32">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:gap-10">
          {/* Logo */}
          <div className="group relative">
            <div className="h-40 w-40 overflow-hidden rounded-[2.5rem] border-4 border-slate-50 bg-white shadow-2xl transition-transform group-hover:scale-[1.02] lg:h-52 lg:w-52 dark:border-[#020617] dark:bg-slate-900">
              {team.logo ? (
                <img src={team.logo} alt="Team Logo" className="h-full w-full object-cover" />
              ) : (
                <Trophy className="h-full w-full p-12 text-slate-300" />
              )}
            </div>
            <div className="absolute -right-2 -bottom-2 rounded-2xl bg-emerald-500 p-2.5 text-white shadow-xl ring-2 ring-slate-50 dark:ring-[#020617]">
              <Shield className="h-6 w-6" />
            </div>
          </div>

          {/* Title Info */}
          <div className="mb-2 flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic lg:text-6xl">
                {team.name}
              </h1>
            </div>
            <p className="mt-1 text-xl font-bold tracking-tighter text-slate-500 lg:text-2xl dark:text-slate-400">
              @{team.abbreviation}
            </p>
            <div className="secondary-text mt-4 flex items-center justify-center gap-4 font-[urbanist] text-xs font-bold uppercase lg:justify-start">
              <div className="flex items-center gap-1">
                <Flag className="h-3 w-3 text-emerald-500" /> Est. Nov 2023
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-indigo-500" /> 12.4k Following
              </div>
            </div>
          </div>

          {alreadyInTeam ? (
            <button
              onClick={() => {
                openConfirmModal({
                  onConfirm: handleLeaveTeam,
                  title: `Leave ${team.name}`,
                  confirmVariant: "destructive",
                  description: "Are you want to leave this team?",
                });
              }}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-400 px-3 py-2 font-[inter] text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400"
            >
              <MinusCircle size={20} className="mr-1" /> Leave
            </button>
          ) : isAlreadySent ? (
            <button
              onClick={() => {
                openConfirmModal({
                  onConfirm: handleWidthdrawRequest,
                  title: `Request`,
                  description: "Are you want to cancel the request",
                });
              }}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-400 px-3 py-2 font-[inter] text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400"
            >
              Sent
            </button>
          ) : team.isRecruiting ? (
            <button
              disabled={isLoading}
              onClick={handleJoinTeam}
              className="primary-btn flex transform cursor-pointer items-center rounded-lg px-4 py-2 font-[urbanist] text-sm hover:opacity-80 active:scale-95"
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
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
    </header>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<LucideProps>;
  color: string;
}
const StatCard = ({ label, value, icon: Icon, color = "indigo" }: StatCardProps) => (
  <div className="group hover-card rounded-3xl p-5">
    <div className="mb-2 flex items-start justify-between">
      <div
        className={`rounded-xl p-2 bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 transition-transform group-hover:scale-110`}
      >
        <Icon className="h-5 w-5" />
      </div>
      {/* <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
        Verified
      </span> */}
    </div>
    <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-lg font-black tracking-tight text-slate-900 uppercase dark:text-white">
      {value}
    </p>
  </div>
);

export default TeamIdPage;
