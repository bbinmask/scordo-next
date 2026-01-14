import { getMatchUrl } from "@/utils/getURL";
import { shortenTeamName } from "@/utils/short";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export const LiveMatchCard = ({ match }: { match: any }) => {
  return (
    <div className="group hover-card relative mb-1 grid w-60 flex-shrink-0 rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
      <Link
        href="#"
        className="text-foreground mb-2 w-fit font-[urbanist] text-[10px] tracking-wide hover:underline"
      >
        Indian Premier League 2025
      </Link>
      <Link
        href={`/matches/${getMatchUrl(match.teamA, match.teamB, new Date(match.startTime), match.uid)}`}
        className="block"
      >
        <div className="mb-2 grid cursor-pointer grid-cols-1">
          <h2 className="primary-heading font-[poppins] text-base font-bold">
            {shortenTeamName("Royal Challengers Bangaluru")}
            <span className="mx-2">vs</span>
            {shortenTeamName("Chennai Super Kings")}
          </h2>
        </div>
        <p className="text-foreground mb-1 font-[poppins] text-xs">
          {shortenTeamName("Royal Challengers Bangaluru")}:{" "}
          <span className="font-medium">{"205/5 (20 overs)"}</span>
        </p>
        <p className="text-foreground font-[poppins] text-xs">
          {shortenTeamName("Chennai Super Kings")}:{" "}
          <span className="font-medium">{"105/5 (15 overs)"}</span>
        </p>
        <p className="font-[urbanist] text-xs leading-10 font-bold text-red-800 dark:text-red-500">
          {`${shortenTeamName("Chennai Super Kings")} needs 101 runs in 30 balls`}
        </p>
        <div className="absolute right-6 bottom-6">
          <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-500 group-hover:translate-x-2 dark:text-gray-500" />
        </div>
      </Link>
      <div className="absolute top-2 right-6">
        <span className="animate-pulse text-xs font-semibold text-red-500 group-hover:animate-none hover:animate-none dark:text-red-400">
          ● {"Live"}
        </span>
      </div>
    </div>
  );
};

interface MatchListProps {
  matches: any[];
  status: "live" | "upcoming";
}

const MatchList = ({ matches, status }: MatchListProps) => {
  return matches.length > 0 ? (
    <>
      {status === "live" && matches.map((match, i) => <LiveMatchCard key={i} match={match} />)}

      {status === "upcoming" &&
        matches.map((match, i) => <UpcomingMatchCard key={i} match={match} />)}
    </>
  ) : null;
};

export default MatchList;

export const UpcomingMatchCard = ({ match }: { match: any }) => {
  return (
    <div className="hover-card group mb-1 flex w-60 flex-shrink-0 transform cursor-pointer flex-row flex-nowrap rounded-xl bg-white p-4 shadow-md transition-transform duration-300 dark:bg-gray-800">
      <div className="w-full">
        <Link
          href="#"
          className="text-foreground mb-2 font-[urbanist] text-[10px] tracking-wide hover:underline"
        >
          Indian Premier League 2025
        </Link>
        <div className="mb-2 grid cursor-pointer grid-cols-1">
          <h2 className="primary-heading font-[poppins] text-base font-bold">
            {shortenTeamName("Royal Challengers Bangaluru")}
            <span className="mx-2">vs</span>
            {shortenTeamName("Chennai Super Kings")}
          </h2>
        </div>
        <p className="text-accent-foreground mb-1 text-sm">
          <span className="mr-1 font-semibold">{"Jul 10, 2025"}</span>at
          <span className="ml-1 font-semibold">{"7:30 PM IST"}</span>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Venue: {"Chinnaswami Stadium, Bangaluru"}
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
