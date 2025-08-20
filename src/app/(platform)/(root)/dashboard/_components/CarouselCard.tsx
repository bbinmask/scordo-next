import { cn } from "@/lib/utils";
import { getMatchUrl } from "@/utils/getURL";
import { shortenTeamName } from "@/utils/short";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export const LiveMatchCard = ({ className, match }: { className?: string; match: any }) => {
  return (
    <div className={cn("relative grid", className)}>
      <Link href="#" className="text-foreground mb-2 w-fit font-[poppins] text-xs hover:underline">
        Indian Premier League 2025
      </Link>
      <Link
        href={`/matches/${getMatchUrl(match.teamA, match.teamB, new Date(match.startTime), match.uid)}`}
        className="block"
      >
        <div className="mb-2 grid cursor-pointer grid-cols-1">
          <h2 className="primary-text font-[cal_sans] text-lg font-bold tracking-wide">
            {shortenTeamName("Royal Challengers Bangaluru")}
            <span className="mx-2">vs</span>
            {shortenTeamName("Chennai Super Kings")}
          </h2>
        </div>
        <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
          {shortenTeamName("Royal Challengers Bangaluru")}:{" "}
          <span className="font-semibold">{"205/5 (20 overs)"}</span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {shortenTeamName("Chennai Super Kings")}:{" "}
          <span className="font-semibold">{"105/5 (15 overs)"}</span>
        </p>
        <p className="text-sm leading-10 font-bold text-red-500">
          {`${shortenTeamName("Chennai Super Kings")} needs 101 runs in 30 balls`}
        </p>
        <div className="absolute right-6 bottom-6">
          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
      </Link>
      <div className="absolute top-6 right-6">
        <span className="animate-pulse text-sm font-semibold text-red-500 dark:text-red-400">
          ● {"Live"}
        </span>
      </div>
    </div>
  );
};

export const UpcomingMatchCard = ({ className, match }: { className?: string; match: any }) => {
  return (
    <div className={cn("flex flex-row flex-nowrap", className)}>
      <div className="w-full">
        <Link href="#" className="text-foreground mb-2 font-[poppins] text-xs hover:underline">
          Indian Premier League 2025
        </Link>
        <div className="mb-2 grid cursor-pointer grid-cols-1">
          <h2 className="primary-text font-[cal_sans] text-lg font-bold tracking-wide">
            {shortenTeamName("Royal Challengers Bangaluru")}
            <span className="mx-2">vs</span>
            {shortenTeamName("Chennai Super Kings")}
          </h2>
        </div>
        <p className="text-accent-foreground mb-1 text-sm">
          <span className="mr-1 font-semibold">{"Jul 10, 2025"}</span>at
          <span className="ml-1 font-semibold">{"7:30 PM IST"}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Venue: {"Chinnaswami Stadium, Bangaluru"}
        </p>
        <div className="mt-1 flex w-full justify-end">
          <button className="flex items-center border-none text-sm font-semibold text-green-600 hover:underline dark:text-emerald-400">
            View Details <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
