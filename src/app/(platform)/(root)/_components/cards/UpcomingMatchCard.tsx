import { MatchWithDetails } from "@/lib/types";
import { formatDate } from "@/utils/helper/formatDate";
import { shortenTeamName } from "@/utils/short";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export const UpcomingMatchCard = ({ match }: { match: MatchWithDetails }) => {
  return (
    <div className="hover-card group mb-1 flex w-60 flex-shrink-0 transform cursor-pointer flex-row flex-nowrap rounded-xl bg-white p-4 shadow-md transition-transform duration-300 dark:bg-gray-800">
      <div className="w-full">
        {match.tournamentId && (
          <Link
            href={`/tournaments/${match.tournamentId}`}
            className="text-foreground mb-2 font-[urbanist] text-[10px] tracking-wide hover:underline"
          >
            Tournament
          </Link>
        )}
        <div className="mb-2 grid cursor-pointer grid-cols-1">
          <h2 className="primary-heading font-[poppins] text-base font-bold">
            {shortenTeamName(match.teamA.name)}
            <span className="mx-2">vs</span>
            {shortenTeamName(match.teamB.name)}
          </h2>
        </div>
        <p className="text-accent-foreground mb-1 text-sm">
          <span className="mr-1 font-semibold">{formatDate(new Date(match.date as Date))}</span>at
          <span className="ml-1 font-semibold">{"7:30 PM IST"}</span>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {`Venue: ${match.venue.city || "TBD"}( ${match.venue.state || "TBD"})`}
        </p>
        <div className="mt-1 flex w-full justify-end pr-2">
          <button className="flex items-center border-none text-sm font-semibold text-green-600 hover:underline dark:text-emerald-400">
            View Details{" "}
            <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-500 ease-in-out group-hover:translate-x-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
