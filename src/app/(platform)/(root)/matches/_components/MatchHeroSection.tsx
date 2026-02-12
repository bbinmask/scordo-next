import { MatchWithDetails, PlayerWithUser } from "@/lib/types";
import { Shield, Trophy } from "lucide-react";
import { useState } from "react";
import { SquadModal } from "./modals/SquadModals";

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
