import { ActionButton } from "@/components/ActionButton";
import { Match } from "@/generated/prisma";
import { MatchWithDetails, UserWithTeamsProps } from "@/lib/types";
import { formatDate } from "@/utils/helper/formatDate";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  user?: UserWithTeamsProps;
}

const HeroSection = ({ user }: HeroSectionProps) => {
  const { data: upcomingMatch } = useQuery<MatchWithDetails>({
    queryKey: ["next-match"],
    queryFn: async () => {
      const { data } = await axios.get("/api/u/profile/next-match");
      if (!data.success) return null;

      return data.data;
    },
  });

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-lg shadow-slate-200/50 lg:p-8 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:shadow-2xl dark:shadow-black/30">
      {/* Subtle background glow effect */}
      <div
        className="absolute top-0 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative z-10">
        <header className="mb-8">
          <div>
            <h1 className="font-[cal_sans] text-2xl font-bold text-slate-800 lg:text-3xl dark:text-slate-100">
              Welcome back,
            </h1>
            <span className="primary-heading font-[poppins] text-3xl font-bold lg:text-4xl">
              {user?.name || "User"}!
            </span>
          </div>
        </header>

        <div className="relative grid items-stretch gap-6 lg:grid-cols-5">
          {/* Upcoming Match Card */}
          {upcomingMatch && (
            <div className="hover-card flex flex-col rounded-xl p-5 ring-1 ring-slate-200/50 transition-all duration-300 hover:ring-slate-300 lg:col-span-3 dark:ring-slate-700/50 dark:hover:ring-slate-600">
              <div className="flex w-full items-center justify-between pb-2">
                <h2 className="mb-4 font-[poppins] text-sm font-semibold tracking-wider text-green-600 uppercase dark:text-emerald-600">
                  Your Next Match
                </h2>
                <Link
                  href={`/matches/${upcomingMatch.id}`}
                  className="text-sm font-medium text-green-600 hover:underline dark:text-emerald-600"
                >
                  View Details
                </Link>
              </div>
              <div className="grid grid-cols-5 items-center justify-between font-[poppins]">
                <Link
                  href={`/teams/${upcomingMatch.teamA.abbreviation}`}
                  className="col-span-2 flex flex-col items-center gap-2 text-center lg:flex-row lg:gap-4"
                >
                  <img
                    src={
                      upcomingMatch.teamA.logo ||
                      `https://placehold.co/60x60/A62626/FFFFFF?text=${upcomingMatch.teamA.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}`
                    }
                    alt={upcomingMatch.teamA.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 lg:h-14 lg:w-14 dark:ring-slate-600"
                  />
                  <span className="font-[poppins] text-sm font-semibold text-slate-800 md:text-lg lg:text-xl dark:text-slate-100">
                    {upcomingMatch.teamA.name}
                  </span>
                </Link>
                <span className="col-span-1 text-center text-lg font-bold text-slate-400 dark:text-slate-500">
                  vs
                </span>
                <Link
                  href={`/teams/${upcomingMatch.teamB.abbreviation}`}
                  className="col-span-2 flex flex-col-reverse items-center gap-2 text-center lg:flex-row lg:gap-4"
                >
                  <span className="font-[poppins] text-sm font-semibold text-slate-800 md:text-lg lg:text-xl dark:text-slate-100">
                    {upcomingMatch.teamB.name}
                  </span>
                  <img
                    src={
                      upcomingMatch.teamB.logo ||
                      `https://placehold.co/60x60/A62626/FFFFFF?text=${upcomingMatch.teamB.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}`
                    }
                    alt={upcomingMatch.teamB.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 lg:h-14 lg:w-14 dark:ring-slate-600"
                  />
                </Link>
              </div>
              <div className="mt-5 border-t border-slate-200 pt-4 text-center dark:border-slate-700">
                <p className="font-inter font-semibold text-slate-700 dark:text-slate-200">
                  {formatDate(new Date(upcomingMatch.date || ""))}
                </p>
                <p className="secondary-text text-sm font-semibold">{`${upcomingMatch.venue.city}( ${upcomingMatch.venue.state} )`}</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row lg:col-span-2 lg:flex-col">
            <ActionButton title="Create a New Match" icon={PlusCircle} href="/matches/create" />
            <ActionButton title="Find a Player" icon={Search} href="/explore" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
