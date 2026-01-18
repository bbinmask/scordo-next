import { ActionButton } from "@/components/ActionButton";
import { UserWithTeamsProps } from "@/lib/types";
import AxiosRequest from "@/utils/AxiosResponse";
import { useQuery } from "@tanstack/react-query";
import { capitalize } from "lodash";
import { LucideProps, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface HeroSectionProps {
  user?: UserWithTeamsProps;
}

const HeroSection = ({ user }: HeroSectionProps) => {
  const upcomingMatch = {
    teamA: { name: "Bengaluru Blasters", logo: "https://placehold.co/60x60/A62626/FFFFFF?text=BB" },
    teamB: { name: "Rival XI", logo: "https://placehold.co/60x60/333/FFF?text=RXI" },
    time: "Tomorrow, 7:30 PM",
    venue: "City Cricket Ground",
  };

  const banner = user?.players[0]?.team?.banner
    ? user?.players[0].team.banner
    : `/assets/banners/hero-team-banner.png`;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-lg shadow-slate-200/50 md:p-8 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:shadow-2xl dark:shadow-black/30">
      {/* Subtle background glow effect */}
      <div
        className="absolute top-0 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative z-10">
        <header className="mb-8">
          <div>
            <h1 className="font-[cal_sans] text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-100">
              Welcome back,
            </h1>
            <span className="primary-heading font-[poppins] text-3xl font-bold md:text-4xl">
              {capitalize(user?.name || "User")}!
            </span>
          </div>
        </header>

        <div className="grid items-stretch gap-6 md:grid-cols-5">
          {/* Upcoming Match Card */}
          <div className="flex flex-col rounded-xl bg-white/60 p-5 shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:ring-slate-300 md:col-span-3 dark:bg-slate-800/50 dark:shadow-lg dark:ring-slate-700/50 dark:hover:ring-slate-600">
            <h2 className="mb-4 font-[poppins] text-sm font-semibold tracking-wider text-green-600 uppercase dark:text-green-500">
              Your Next Match
            </h2>
            <div className="grid grid-cols-5 items-center justify-between font-[poppins]">
              <div className="col-span-2 flex flex-col items-center gap-2 text-center md:flex-row md:gap-4">
                <img
                  src={upcomingMatch.teamA.logo}
                  alt={upcomingMatch.teamA.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 md:h-14 md:w-14 dark:ring-slate-600"
                />
                <span className="font-[poppins] text-lg font-semibold text-slate-800 md:text-xl dark:text-slate-100">
                  {upcomingMatch.teamA.name}
                </span>
              </div>
              <span className="col-span-1 text-center text-lg font-bold text-slate-400 dark:text-slate-500">
                vs
              </span>
              <div className="col-span-2 flex flex-col-reverse items-center gap-2 text-center md:flex-row md:gap-4">
                <span className="font-[poppins] text-lg font-semibold text-slate-800 md:text-xl dark:text-slate-100">
                  {upcomingMatch.teamB.name}
                </span>
                <img
                  src={upcomingMatch.teamB.logo}
                  alt={upcomingMatch.teamB.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 md:h-14 md:w-14 dark:ring-slate-600"
                />
              </div>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-4 text-center dark:border-slate-700">
              <p className="font-inter font-semibold text-slate-700 dark:text-slate-200">
                {upcomingMatch.time}
              </p>
              <p className="secondary-text text-sm font-semibold">{upcomingMatch.venue}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col justify-center space-y-4 md:col-span-2">
            <ActionButton title="Create a New Match" icon={PlusCircle} href="/matches/create" />
            <ActionButton title="Find a Player" icon={Search} href="/explore" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
