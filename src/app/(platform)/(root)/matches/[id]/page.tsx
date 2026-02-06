"use client";

import { OfficialRole, User } from "@/generated/prisma";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  Shield,
  Trophy,
  Sparkles,
  Loader2,
  X,
  BrainCircuit,
  MapPin,
  Clock,
  Calendar,
  Activity,
  Sword,
  Flame,
  Gavel,
  Share2,
  MoreVertical,
  Home,
  MoreHorizontal,
  MonitorPlay,
  Target,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserCircle2,
  Plus,
  Minus,
  Trash,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { DefaultLoader } from "@/components/Spinner";
import { InningDetails, MatchWithTeamAndOfficials, PlayerWithUser } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
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
const LiveScorecard = ({ inning }: { inning: InningDetails }) => {
  if (!inning) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full space-y-6 duration-700">
      {/* Live Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <div className="absolute top-0 right-0 p-8">
          <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">
              Live Match
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <p className="mb-2 text-xs font-black tracking-[0.2em] text-green-500 uppercase">
              Current Innings: {inning.battingTeam.name}
            </p>
            <div className="flex items-baseline gap-4">
              <h2 className="text-6xl font-black tracking-tighter text-slate-900 uppercase dark:text-white">
                {inning.runs}/{inning.wickets}
              </h2>
              <p className="text-xl font-bold text-slate-400">
                ({inning.overs}.{inning.balls} Overs)
              </p>
            </div>
            <p className="mt-4 text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              CRR: {(inning.runs / (inning.overs + inning.balls / 6) || 0).toFixed(2)}
            </p>
          </div>

          <div className="flex w-full flex-col items-end gap-2 md:w-auto">
            <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Partnership: 42 (34)
            </p>
            <div className="flex gap-2">
              {[4, 1, "wd", ".", 6, "W"].map((ball, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black ${
                    ball === "W"
                      ? "border-red-600 bg-red-500 text-white"
                      : ball === 4 || ball === 6
                        ? "border-green-600 bg-green-500 text-white"
                        : "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  {ball}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Batting Table */}
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
              <Target className="h-4 w-4 text-green-500" /> Batting
            </h3>
            <span className="text-[10px] font-bold text-slate-400">{inning.battingTeam.name}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-black tracking-widest text-slate-400 uppercase dark:bg-white/5">
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
                {[
                  { name: "Virat Kohli", runs: 74, balls: 48, fours: 6, sixes: 3, striker: true },
                  {
                    name: "Faf du Plessis",
                    runs: 32,
                    balls: 22,
                    fours: 2,
                    sixes: 1,
                    striker: false,
                  },
                ].map((player, i) => (
                  <tr key={i} className={`${player.striker ? "bg-green-500/5" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-tight text-slate-900 uppercase dark:text-white">
                          {player.name}
                        </span>
                        {player.striker && (
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-black text-slate-900 dark:text-white">
                      {player.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                      {player.balls}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                      {player.fours}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                      {player.sixes}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-black text-green-500 italic">
                      {((player.runs / player.balls) * 100).toFixed(1)}
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
            <span className="text-[10px] font-bold text-slate-400">{inning.bowlingTeam.name}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-black tracking-widest text-slate-400 uppercase dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3">Bowler</th>
                  <th className="px-4 py-3 text-center">O</th>
                  <th className="px-4 py-3 text-center">M</th>
                  <th className="px-4 py-3 text-center">R</th>
                  <th className="px-4 py-3 text-center">W</th>
                  <th className="px-4 py-3 text-center">ECON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {[
                  {
                    name: "Jasprit Bumrah",
                    overs: 3.4,
                    maidens: 0,
                    runs: 24,
                    wickets: 2,
                    current: true,
                  },
                  {
                    name: "Hardik Pandya",
                    overs: 4,
                    maidens: 0,
                    runs: 38,
                    wickets: 1,
                    current: false,
                  },
                ].map((player, i) => (
                  <tr key={i} className={`${player.current ? "bg-green-500/5" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-tight text-slate-900 uppercase dark:text-white">
                          {player.name}
                        </span>
                        {player.current && (
                          <Activity className="h-3 w-3 animate-pulse text-green-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-black text-slate-900 dark:text-white">
                      {player.overs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                      {player.maidens}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                      {player.runs}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-black text-green-500">
                      {player.wickets}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-black text-slate-400">
                      {(player.runs / player.overs).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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
    <DialogContent className="overflow-hidden p-0">
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
              <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                {teamName}
              </h2>
              <p className={`text-[10px] font-black tracking-[0.2em] text-green-500 uppercase`}>
                {players?.length} Active
              </p>
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
                  <h4 className="text-sm font-black tracking-tight text-slate-900 uppercase dark:text-white">
                    {player.user.name}
                  </h4>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase italic">
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
          Dismiss Roster
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
  const { data: match, isLoading } = useQuery<MatchWithTeamAndOfficials>({
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

  const [squadModalState, setSquadModalState] = useState<SquadState>({ isOpen: false });
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

  const handleCloseSquad = () => {
    setSquadModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleOpenSquad = (
    teamName: string,
    teamLogo: string | null,
    players: PlayerWithUser[]
  ) => {
    setSquadModalState({ players, teamName, teamLogo: teamLogo || undefined, isOpen: true });
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
            <div className="relative h-64 w-full overflow-hidden md:h-96">
              {/* Composite Banner Logic with Fallbacks */}
              <div className="absolute inset-0 flex">
                {/* Team A Banner Side */}
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

                {/* Team B Banner Side */}
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

            {/* Versus Main Header */}
            <div className="relative z-10 mx-auto -mt-24 max-w-7xl px-6 md:-mt-32">
              <div className="flex flex-col items-center">
                {/* Visual Versus Display */}
                <div className="animate-in zoom-in mb-8 flex items-center gap-4 duration-500 md:gap-12">
                  {/* Team A Logo Frame */}
                  <div className="group relative">
                    <div
                      onClick={() =>
                        handleOpenSquad(match.teamA.name, match.teamA.logo, match.teamA.players)
                      }
                      className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2.5rem] border-8 border-slate-50 bg-white shadow-2xl transition-transform group-hover:scale-105 md:h-52 md:w-52 dark:border-[#020617] dark:bg-slate-900"
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
                    <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-green-600 text-2xl font-black text-white italic shadow-xl shadow-green-500/30 hover:animate-none md:h-24 md:w-24 md:text-4xl">
                      VS
                    </div>
                    <div className="mt-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
                      <span className="font-[poppins] text-xs font-semibold tracking-wider text-white uppercase">
                        Scordo Match
                      </span>
                    </div>
                  </div>

                  {/* Team B Logo Frame */}
                  <div className="group relative">
                    <div
                      onClick={() =>
                        handleOpenSquad(match.teamB.name, match.teamB.logo, match.teamB.players)
                      }
                      className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2.5rem] border-8 border-slate-50 bg-white shadow-2xl transition-transform group-hover:scale-105 md:h-52 md:w-52 dark:border-[#020617] dark:bg-slate-900"
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

                {/* Match Title & Actions */}
                <div className="w-full max-w-4xl text-center">
                  <div className="center mb-4 flex flex-col text-3xl font-black tracking-tighter uppercase italic md:text-5xl">
                    <h1 className="text-start">{match.teamA.name}</h1>
                    <span className="primary-heading pr-2 text-center">vs</span>
                    <h1 className="text-end"> {match.teamB.name}</h1>
                  </div>

                  <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                    {isOrganizer && (
                      <button
                        onClick={() => setIsInitializing(true)}
                        className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-[poppins] text-xs font-semibold tracking-widest text-slate-900 uppercase shadow-lg transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                      >
                        Initialize Match
                      </button>
                    )}
                    <button className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-400 shadow-lg transition-all hover:text-green-500 dark:border-white/10 dark:bg-slate-800">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <Separator />
                <div className="mt-4 w-full space-y-12">
                  <div className="mt-4 grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
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
                  <div className="flex items-center justify-between px-4">
                    <h3 className="flex items-center gap-3 font-sans text-xl font-black tracking-tighter uppercase italic">
                      <MonitorPlay className="primary-heading" /> Match
                      <span className="primary-heading">Center</span>
                    </h3>
                    <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Powered by Scordo
                    </span>
                  </div>
                  {/* Conditional Scorecard rendering */}
                  {match.status === "in_progress" ? (
                    <LiveScorecard inning={null as any} />
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

          <SquadModal onClose={handleCloseSquad} {...squadModalState} />
          <InitializeMatchModal
            isOpen={isInitializing}
            match={match}
            onClose={() => setIsInitializing(false)}
          />
        </>
      )}
    </div>
  );
};

export default MatchIdPage;
