"use client";
import { Users, Trophy, User, PlusCircle, Star } from "lucide-react";
import Link from "next/link";
import TeamProps from "@/types/teams.props";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { formatDate } from "date-fns";
import Spinner from "@/components/Spinner";
import { getTeamUrl } from "@/utils/getURL";
import { useTeamRequest } from "@/hooks/useTeam";
import { user } from "@/constants";
import { defaultTeamLogo } from "@/constants/urls";
import { Player, Team } from "@/generated/prisma";

interface TeamWithPlayers extends Team {
  players: Player[];
  captain: string | { name: string } | null;
}

export function TeamsList({ teams }: { teams: TeamWithPlayers[] }) {
  if (!teams) return notFound();

  return (
    <div className="grid w-full gap-4 rounded-lg px-2 py-4 md:grid-cols-2 xl:grid-cols-3">
      {teams.length !== 0 && teams.map((team) => <TeamCard key={team.id} team={team} />)}
    </div>
  );
}

export const TeamCard = ({ team }: { team: TeamWithPlayers }) => {
  const { joinTeam, withdrawJoinRequest, loading, isAlreadyInTeam, isAlreadyRequested } =
    useTeamRequest(team, user);

  const teamSlug = getTeamUrl(team);
  const encodedSlug = encodeURIComponent(teamSlug);

  return (
    <Link
      href={`/teams/${encodedSlug}`}
      className="relative aspect-video h-full w-full overflow-hidden rounded-xl border-gray-600 font-[poppins] shadow-black transition-all duration-300 hover:border-emerald-700 hover:opacity-95 hover:shadow-md focus:ring-2 focus:ring-emerald-700 dark:border"
    >
      <div
        style={{
          backgroundImage: `url(${team.banner || defaultTeamLogo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
        className="absolute inset-0 z-0"
      ></div>
      <div className="absolute inset-0 bg-gray-800 opacity-80" />
      <div className="relative z-10 flex flex-col items-start space-y-4 border-none px-3 py-2">
        {/* Team Icon/Placeholder */}
        <div className="rounded-full shadow-lg">
          {team.logo === "" ? (
            <Trophy className="h-10 w-10 text-white" />
          ) : (
            <img
              src={team.logo || undefined}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
        </div>

        {/* Team Details */}
        <div className="flex-grow px-4 text-center">
          <div className="mb-2">
            <abbr
              title={team.name}
              className="mb-1 overflow-x-clip font-[cal_sans] text-2xl font-medium text-nowrap text-gray-50 no-underline hover:text-blue-400 md:text-xl dark:text-gray-200"
            >
              {team.name}
            </abbr>
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-gray-50">
            <p className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-purple-400" />{" "}
              {`${team.players.length} ${team.players.length > 1 ? "Members" : "Member"}`}
            </p>
            {typeof team.captain !== "string" && (
              <p className="flex items-center">
                <User className="mr-2 h-4 w-4 text-emerald-400" />
                {`Captain: ${team.captain?.name || "N/A"}`}
              </p>
            )}
            <p className="flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-400" />
              {`Type: ${team.type}`}
            </p>
            {/* <p className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-orange-400" /> Wins: {team.win}
          </p>
          <p className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4 text-red-400" /> Losses:
            {team.losses}
          </p>*/}
            <p className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4 text-cyan-400" />
              {`Established: ${team.createdAt && formatDate(new Date(team.createdAt), "yyyy-MM-dd")}`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2 flex-shrink-0">
          {isAlreadyRequested ? (
            <Button
              variant={"destructive"}
              onClick={withdrawJoinRequest}
              disabled={loading || !isAlreadyRequested}
              className={`inline-flex items-center rounded-full border-none bg-red-600 text-[10px] font-semibold text-white drop-shadow-lg hover:scale-105 hover:bg-red-600/80`}
            >
              {loading ? <Spinner /> : "cancel"}
            </Button>
          ) : (
            <Button
              variant={"default"}
              onClick={joinTeam}
              disabled={!team.isRecruiting || loading || isAlreadyInTeam || isAlreadyRequested}
              className={`px- inline-flex items-center rounded-full border-none text-[10px] font-semibold shadow-md hover:scale-105 hover:shadow-xl ${team.isRecruiting ? "bg-main hover:bg-hover active:bg-active text-white" : "bg-purple-600 text-white"}`}
            >
              {loading ? (
                <Spinner />
              ) : isAlreadyRequested ? (
                "sent"
              ) : isAlreadyInTeam ? (
                "Joined"
              ) : team.isRecruiting ? (
                "Join"
              ) : (
                "Full"
              )}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};
