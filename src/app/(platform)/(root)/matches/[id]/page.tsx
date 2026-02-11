"use client";

import { Ball, OfficialRole, User } from "@/generated/prisma";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Trophy,
  MapPin,
  Calendar,
  Activity,
  Sword,
  Flame,
  Gavel,
  Share2,
  Target,
  ShieldCheck,
  UserCheck,
  UserCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { DefaultLoader } from "@/components/Spinner";
import { InningDetails, MatchWithDetails, PlayerWithUser } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { capitalize } from "lodash";
import { useAction } from "@/hooks/useAction";
import { addOfficials } from "@/actions/match-actions";
import { toast } from "sonner";
import InitializeMatchModal from "../_components/modals/InitializeMatchModal";
import { type MatchOfficial } from "../_types/types";
import { AddOfficialModal } from "../_components/AddOfficialsModal";
import { ControlPad } from "../_components/ControlPad";
import ScorecardModal from "../_components/modals/ScorecardModal";
import { getCRR, getEcon, getPartnership, getRR, getStrikeRate } from "@/utils/helper/scorecard";

interface MatchIdPageProps {}

interface InfoCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  subValue: string;
}

const InfoCard = ({ label, value, icon: Icon, color = "green", subValue = "" }: InfoCardProps) => (
  <div className="group hover-card relative overflow-hidden rounded-3xl p-6">
    <div className="relative z-10">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-transform group-hover:scale-110 dark:bg-green-500/10 dark:text-green-400`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-lg font-black tracking-tight text-slate-900 uppercase dark:text-white">
        {value}
      </p>
      {subValue && <p className="mt-1 text-[10px] font-bold text-slate-400">{subValue}</p>}
    </div>
  </div>
);
const LiveScorecard = ({ match, userId }: { match: MatchWithDetails; userId?: string }) => {
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);

  const {
    data: innings,
    isLoading: inningsLoading,
    refetch,
  } = useQuery<InningDetails[]>({
    queryKey: ["match-innings", match.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${match.id}/innings`);

      if (!data.success) return [];

      return data.data;
    },
  });
  if (!innings) return null;
  const length = innings.length - 1;

  return (
    <>
      {/* Live Header Banner */}
      <div className="relative mb-4 flex items-start justify-between overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <div className="w-[90%]">
          <p className="mb-2 w-full truncate overflow-x-clip font-[inter] text-xs font-bold text-nowrap text-green-500 uppercase">
            Current Innings: {innings[length].battingTeam.name}
          </p>
          <div className="flex items-baseline gap-4">
            <h2 className="text-6xl font-black tracking-tighter text-slate-900 uppercase dark:text-white">
              {innings[length].runs}/{innings[length].wickets}
            </h2>
            <p className="text-xl font-bold text-slate-400">
              ({innings[length].overs}.{innings[length].balls} Overs)
            </p>
          </div>
          <p className="mt-4 font-[urbanist] text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            CRR: {getCRR(innings[length].runs, innings[length].balls)}
          </p>
          <p className="font-[urbanist] text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            RR: {`${getRR(innings[length].runs, innings[length].balls)}`}
          </p>
        </div>
        <div className="flex w-[10%] items-center justify-evenly rounded-full border border-red-500/20 bg-red-500/10 px-1 py-0.5">
          <div className="h-1 w-1 animate-pulse rounded-full bg-red-500" />
          <span className="text-[8px] font-bold text-red-500 uppercase">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 font-[poppins] lg:grid-cols-2">
        {/* Batting Table */}
        <div className="border-input overflow-hidden rounded-[2.5rem] border bg-white shadow-sm dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
              <Target className="h-4 w-4 text-green-500" /> Batting
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              {innings[length].battingTeam.name}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-semibold tracking-widest text-slate-400 uppercase dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3">Batter</th>
                  <th className="px-4 py-3 text-center">R</th>
                  <th className="px-4 py-3 text-center">B</th>
                  <th className="px-4 py-3 text-center">4s</th>
                  <th className="px-4 py-3 text-center">6s</th>
                  <th className="px-4 py-3 text-center">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {innings[length].InningBatting.filter(
                  (inn) =>
                    inn.playerId === innings[length].currentStrikerId ||
                    inn.playerId === innings[length].currentNonStrikerId
                ).map((inn, i) => (
                  <tr
                    key={i}
                    className={`${inn.playerId === innings[length].currentStrikerId ? "bg-green-500/5" : ""}`}
                  >
                    <td className="px-6 py-4 font-[poppins]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
                          {inn?.player.user.name}
                        </span>
                        {inn.playerId === innings[length].currentStrikerId && (
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-900 dark:text-white">
                      {inn.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {inn.balls}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {inn.fours}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                      {inn.sixes}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-semibold text-green-500">
                      {getStrikeRate(inn.runs, inn.balls)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling Table */}
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
              <Flame className="h-4 w-4 text-green-500" /> Bowling
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              {innings[length].bowlingTeam.name}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 font-[inter] text-[9px] font-black tracking-widest text-slate-400 uppercase dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3">Bowler</th>
                  <th className="px-4 py-3 text-center">O</th>
                  <th className="px-4 py-3 text-center">M</th>
                  <th className="px-4 py-3 text-center">R</th>
                  <th className="px-4 py-3 text-center">W</th>
                  <th className="px-4 py-3 text-center">ECON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-[urbanist] dark:divide-white/5">
                {innings[length].InningBowling.filter(
                  (inn) => inn.playerId === innings[length].currentBowlerId
                ).map((player, i) => (
                  <tr key={i} className={`bg-green-500/5`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 uppercase dark:text-white">
                          {player.player.user.name}
                        </span>
                        {/* {player.current && (
                        <Activity className="h-3 w-3 animate-pulse text-green-500" />
                        )} */}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {`${player.overs} ${player.balls % 6 === 0 ? "" : "." + (player.balls % 6)}`}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                      {player.maidens}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                      {player.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-green-500">
                      {player.wickets}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-semibold text-slate-400">
                      {getEcon(player.runs, player.overs, player.balls)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <button
          onClick={() => setIsScorecardOpen(true)}
          className="center flex w-full flex-1 gap-1 rounded-2xl bg-slate-900 px-8 py-4 font-[inter] text-white shadow-xl transition-all active:scale-95 dark:bg-white dark:text-slate-900"
        >
          <span className="text-xs font-black uppercase">Scorecard</span>
        </button>
        <div className="flex w-full flex-col items-end gap-1 md:w-auto">
          <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Partnership: {getPartnership(innings[length].ballsData)}
          </p>
          <div className="flex gap-2">
            {[4, 1, "wd", ".", 6, "W"].map((ball, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black dark:border-transparent ${
                  ball === "W"
                    ? "border-red-600 bg-red-500 text-white"
                    : ball === 4 || ball === 6
                      ? "border-emerald-600 bg-emerald-500 text-white"
                      : "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                }`}
              >
                {ball}
              </div>
            ))}
          </div>
        </div>
      </div>
      {match.status === "in_progress" &&
        match.matchOfficials.findIndex((official) => official.userId === userId) !== -1 && (
          <ControlPad innings={innings[length]} />
        )}
      <ScorecardModal
        isOpen={isScorecardOpen}
        innings={innings}
        onClose={() => setIsScorecardOpen(false)}
      />
    </>
  );
};

const OfficialsModal = ({
  officials,
  onClose,
  players,
  isOpen,
  onSubmit,
  isOrganizer,
}: {
  officials: MatchOfficial[];
  isOpen: boolean;
  onClose: () => void;
  players: PlayerWithUser[];
  onSubmit: (matchOffcials: MatchOfficial[]) => void;
  isOrganizer: boolean;
}) => {
  const [isAddingOfficial, setIsAddingOfficial] = useState(false);

  const onOpen = () => {
    setIsAddingOfficial(true);
  };

  if (!officials) return null;
  return (
    <>
      <Dialog onOpenChange={onClose} open={isOpen}>
        <DialogContent className="bg-white backdrop-blur-md dark:bg-slate-950/80">
          <DialogHeader className="px-3">
            <DialogTitle>
              <div className="flex items-center gap-2 rounded-2xl">
                <h2 className="font-[poppins] text-xl font-black text-slate-900 uppercase italic dark:text-white">
                  Match Officials
                </h2>
                <Gavel className="h-6 w-6 text-white" />
              </div>
            </DialogTitle>
            <DialogDescription className="text-left text-[10px] font-black tracking-wider text-green-500 uppercase">
              Authorized Personnel
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-4 pt-4">
            {officials?.length === 0 ? (
              <NotFoundParagraph
                className="font-[poppins] font-bold uppercase"
                description="No officials appointed"
              />
            ) : (
              officials.map((official, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 transition-all hover:border-green-500/50 dark:border-white/5 dark:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    {official.role.includes("UMPIRE") ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    <div>
                      <h4 className="font-[poppins] text-sm font-semibold tracking-tight text-slate-900 uppercase dark:text-white">
                        {official.name}
                      </h4>
                      <p className="font-[urbanist] text-[10px] font-bold text-green-500">
                        {capitalize(official.role.replace("_", " "))}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>
              ))
            )}
          </div>
          <div className="flex w-full items-center gap-2">
            {isOrganizer && (
              <button
                className="w-full rounded-2xl bg-green-800 py-4 text-xs font-bold tracking-wide text-white uppercase shadow-lg shadow-green-500/20 transition-all active:scale-95 dark:bg-green-600"
                onClick={() => {
                  if (players.length === 0) {
                    toast.error("No players left to appointed");
                    onClose();
                  } else onOpen();
                }}
              >
                Add Official
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-slate-900 py-4 text-xs font-bold tracking-wide text-white uppercase transition-all active:scale-95 dark:bg-gray-500"
            >
              {isOrganizer ? "Cancel" : "Back"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <AddOfficialModal
        onSubmit={onSubmit}
        isOpen={isAddingOfficial}
        onClose={() => setIsAddingOfficial(false)}
        players={players}
      />
    </>
  );
};

interface SquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName?: string;
  teamLogo?: string;
  players?: PlayerWithUser[];
}
const SquadModal = ({ isOpen, onClose, teamName, teamLogo, players }: SquadModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="overflow-hidden p-0 font-[poppins]">
      <DialogHeader className={`bg-gradient-to-br from-green-500/10 to-transparent p-6 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {teamLogo ? (
                <img src={teamLogo} alt={teamName} className="h-full w-full object-cover" />
              ) : (
                <Shield className={`h-8 w-8 text-green-500/40`} />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tighter text-slate-900 uppercase italic dark:text-white">
                {teamName}
              </DialogTitle>
              <DialogDescription
                className={`w-full text-left text-[10px] font-semibold tracking-wide text-green-500 uppercase`}
              >
                {players?.length} Active
              </DialogDescription>
            </div>
          </div>
        </div>
      </DialogHeader>
      <div className="hide_scrollbar mt-4 max-h-[40vh] space-y-3 overflow-y-auto px-4 pr-2">
        {!players || players?.length === 0 ? (
          <NotFoundParagraph description="No players in the squad" />
        ) : (
          players.map((player: any, idx: number) => (
            <div
              key={idx}
              className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-emerald-500/50 dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:text-emerald-500 dark:bg-slate-800 dark:text-slate-500">
                  <UserCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-[inter] text-sm font-semibold tracking-tight text-slate-900 uppercase dark:text-white">
                    {player.user.name}
                  </h4>
                  <p className="font-[urbanist] text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                    Core Squad
                  </p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
          ))
        )}
      </div>
      <DialogFooter className="p-4">
        <button
          onClick={onClose}
          className={`w-full rounded-2xl bg-green-600 py-4 text-xs font-bold tracking-wide text-white uppercase shadow-xl shadow-green-500/20 transition-all active:scale-95`}
        >
          Dismiss
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

type SquadState = {
  teamName?: string;
  teamLogo?: string;
  isOpen: boolean;
  players?: PlayerWithUser[];
};

export const MatchHeroSection = ({ match }: { match: MatchWithDetails }) => {
  const [squadModalState, setSquadModalState] = useState<SquadState>({ isOpen: false });

  const handleOpenSquad = (
    teamName: string,
    teamLogo: string | null,
    players: PlayerWithUser[]
  ) => {
    setSquadModalState({ players, teamName, teamLogo: teamLogo || undefined, isOpen: true });
  };
  const handleCloseSquad = () => {
    setSquadModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className="relative h-64 w-full overflow-hidden md:h-96">
        {/* Banner */}
        <div className="absolute inset-0 flex">
          {/* Team A Banner*/}
          <div className="relative flex-1 overflow-hidden border-r-2 border-slate-900/10 dark:border-white/5">
            {match.teamA.banner ? (
              <img
                src={match.teamA.banner}
                className="h-full w-full object-cover opacity-60"
                alt="Team A Banner"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-900 via-green-950 to-slate-900 opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          </div>

          {/* Team B Banner */}
          <div className="relative flex-1 overflow-hidden">
            {match.teamB.banner ? (
              <img
                src={match.teamB.banner}
                className="h-full w-full object-cover opacity-60"
                alt="Team B Banner"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-bl from-red-900 via-rose-950 to-slate-900 opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-transparent to-transparent" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-50 dark:to-[#020617]" />
      </div>
      <div className="animate-in zoom-in z-10 mx-auto -mt-24 mb-8 flex max-w-7xl items-center justify-between gap-4 px-6 duration-500 md:-mt-32 md:gap-12">
        {/* Team A Logo Frame */}
        <div className="group relative">
          <div
            onClick={() => handleOpenSquad(match.teamA.name, match.teamA.logo, match.teamA.players)}
            className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-slate-50 bg-white shadow-2xl transition-transform group-hover:scale-105 md:h-52 md:w-52 dark:border-[#020617] dark:bg-slate-900"
          >
            {match.teamA.logo ? (
              <img
                src={match.teamA.logo}
                alt={match.teamA.abbreviation}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-800">
                <Shield className="h-16 w-16 text-blue-500/40 md:h-24 md:w-24" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -left-2 rounded-xl bg-blue-600 px-4 py-1 text-xs font-black tracking-widest text-white uppercase shadow-lg">
            {match.teamA.abbreviation}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-green-600 text-2xl font-black text-white italic shadow-xl shadow-green-500/30 md:h-24 md:w-24 md:text-4xl">
            VS
          </div>
          <div className="border-input secondary-text mt-4 rounded-full border bg-teal-900/20 px-3 py-2 font-[poppins] text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-md dark:bg-slate-800/10">
            Scordo Match
          </div>
        </div>

        {/* Team B Logo Frame */}
        <div className="group relative">
          <div
            onClick={() => handleOpenSquad(match.teamB.name, match.teamB.logo, match.teamB.players)}
            className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-slate-50 bg-white shadow-2xl transition-transform group-hover:scale-105 md:h-52 md:w-52 dark:border-[#020617] dark:bg-slate-900"
          >
            {match.teamB.logo ? (
              <img
                src={match.teamB.logo}
                alt={match.teamB.abbreviation}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-800">
                <Trophy className="h-16 w-16 text-red-500/40 md:h-24 md:w-24" />
              </div>
            )}
          </div>
          <div className="absolute -right-2 -bottom-2 rounded-xl bg-red-600 px-4 py-1 text-xs font-black tracking-widest text-white uppercase shadow-lg">
            {match.teamB.abbreviation}
          </div>
        </div>
      </div>
      <SquadModal onClose={handleCloseSquad} {...squadModalState} />
    </>
  );
};

const MatchIdPage = ({}: MatchIdPageProps) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { execute } = useAction(addOfficials, {
    onSuccess(data) {
      toast.success("Officials Added");
      queryClient.invalidateQueries({ queryKey: ["match", id] });
      handleClose();
    },
    onError(error) {
      toast.error(error);
    },
  });
  const { data: match, isLoading } = useQuery<MatchWithDetails>({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${id}`);

      return data.data;
    },
  });

  const { data: user } = useQuery<User>({
    queryKey: ["organizer", id],
    queryFn: async () => {
      const { data } = await axios.get("/api/me");

      return data.data;
    },
  });

  const [isInitializing, setIsInitializing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddOfficial = (matchOfficials: MatchOfficial[]) => {
    if (!match) return;

    execute({ matchId: match.id, matchOfficials });
  };

  const players: PlayerWithUser[] = useMemo(() => {
    const teamAPlayers = match?.teamA.players || [];
    const teamBPlayers = match?.teamB.players || [];

    const uniquePlayers = Array.from(
      new Map([...teamAPlayers, ...teamBPlayers].map((p) => [p.userId, p])).values()
    ).filter((pl) => !match?.matchOfficials.some((official) => official.userId === pl.userId));

    return uniquePlayers as PlayerWithUser[];
  }, [match]);

  const isOrganizer = useMemo(() => {
    return match?.organizerId === user?.id;
  }, [user, match]);

  return (
    <div className={`font-sans transition-colors duration-500`}>
      {isLoading ? (
        <DefaultLoader />
      ) : !match?.id ? (
        <NotFoundParagraph
          redirect
          link="/matches"
          title="Match not found"
          description="This match is not available"
        />
      ) : (
        <>
          <div className="min-h-screen bg-slate-50 pb-32 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
            {/* Hero Section */}

            <MatchHeroSection match={match} />

            <div className="flex flex-col items-center px-4">
              {/* Match Title & Actions */}
              <div className="w-full max-w-4xl text-center">
                <div className="center mb-4 flex flex-col text-3xl font-black tracking-tighter uppercase italic md:text-5xl">
                  <h1 className="text-start">{match.teamA.name}</h1>
                  <span className="primary-heading pr-2 text-center">vs</span>
                  <h1 className="text-end"> {match.teamB.name}</h1>
                </div>

                <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                  {isOrganizer ? (
                    <>
                      {match.requestStatus === "pending" ? (
                        <span className="border-input secondary-text rounded-2xl border bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest shadow-lg transition-all hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                          Request Pending
                        </span>
                      ) : (
                        match.status === "not_started" && (
                          <button
                            onClick={() => setIsInitializing(true)}
                            className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest text-slate-900 shadow-lg transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                          >
                            Initialize Match
                          </button>
                        )
                      )}
                    </>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest text-slate-900 shadow-lg transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                      {match.status === "not_started" && "Not started yet"}
                    </div>
                  )}
                  <button className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-400 shadow-lg transition-all hover:text-green-500 dark:border-white/10 dark:bg-slate-800">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 w-full space-y-12">
                <div className="space-y-12">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="flex items-center gap-3 font-[poppins] text-2xl font-black uppercase italic lg:text-3xl">
                      Match
                      <span className="primary-heading pr-2">Center</span>
                    </h3>
                    <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
                    <span className="font-[urbanist] text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Powered by Scordo
                    </span>
                  </div>
                  {/* Scorecard */}
                  {match.status === "in_progress" ? (
                    <LiveScorecard match={match} userId={user?.id} />
                  ) : (
                    <div className="animate-in fade-in group hover-card relative overflow-hidden rounded-[3rem] border border-dashed border-slate-200 p-12 text-center font-sans duration-1000 dark:border-white/10">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 transition-transform group-hover:scale-110 dark:bg-white/5">
                        <Sword className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      </div>
                      <h4 className="mb-2 text-xl font-black tracking-tight uppercase">
                        Awaiting Toss Results
                      </h4>
                      <p className="mx-auto max-w-sm text-xs leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
                        The match engine is on standby. The live scoreboard and ball-by-ball feed
                        will initialize once the toss decision is logged.
                      </p>
                    </div>
                  )}
                </div>
                <div className="">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="flex items-center gap-3 font-[poppins] text-2xl font-black uppercase italic lg:text-3xl">
                      Match
                      <span className="primary-heading pr-2">Details</span>
                    </h3>
                    <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
                    <span className="font-[urbanist] text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Powered by Scordo
                    </span>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    <InfoCard
                      label="Stadium Venue"
                      value={match.location || "TBD"}
                      icon={MapPin}
                      color="green"
                      subValue={`${match.venue.city}, ${match.venue.country}`}
                    />
                    <InfoCard
                      label="Match Category"
                      value={match.category}
                      icon={Activity}
                      color="blue"
                      subValue={`${match.overs} Over Restricted`}
                    />
                    <InfoCard
                      label="Scheduled Kickoff"
                      value="Jan 31, 2026"
                      icon={Calendar}
                      color="amber"
                      subValue="Match Not Started"
                    />
                    <div className="" onClick={handleOpen}>
                      <InfoCard
                        label="Official Assigned"
                        value={`${match.matchOfficials.length} Officials`}
                        icon={Gavel}
                        color="green"
                        subValue={"See all officials list of the match"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OfficialsModal
            isOrganizer={isOrganizer}
            onSubmit={handleAddOfficial}
            players={players || []}
            isOpen={isOpen}
            officials={match?.matchOfficials || []}
            onClose={handleClose}
          />

          {isOrganizer && (
            <InitializeMatchModal
              isOpen={isInitializing}
              match={match}
              onClose={() => setIsInitializing(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MatchIdPage;
