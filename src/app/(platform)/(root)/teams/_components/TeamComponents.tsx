"use client";
import { Users, Trophy, User, PlusCircle, Star, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import TeamProps from "@/types/teams.props";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { formatDate } from "date-fns";
import Spinner from "@/components/Spinner";
import { getTeamUrl } from "@/utils/getURL";
import { useTeam, useTeamRequest } from "@/hooks/useTeam";
import { user } from "@/constants";
import { mockTeams as teams } from "@/constants/index";

export function TeamsList() {
  // const [teams, setTeams] = useState<TeamProps[]>([]);
  // const { fetchTeams } = useTeam();

  // useEffect(() => {
  //   const getTeams = async () => {
  //     const data = await fetchTeams();
  //     if (data) setTeams(data);
  //   };
  //   getTeams();
  // }, [fetchTeams]);

  if (!teams) return notFound();

  return (
    <div className="bg-background-primary grid w-full gap-4 rounded-lg p-[5%] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teams.length !== 0 && teams.map((team) => <CricketTeamCard key={team.id} team={team} />)}
    </div>
  );
}
export function CricketTeamDetailPage({ teamId }: { teamId: string }) {
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadTeam = async () => {
  //     setLoading(true);
  //     const fetchedTeam = await fetchCricketTeamById(teamId);
  //     setTeam(fetchedTeam);
  //     setLoading(false);
  //   };
  //   loadTeam();
  // }, [teamId]);

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Loading team details...</div>;
  }

  if (!team) {
    return (
      <div className="container mx-auto rounded-lg border border-gray-200 bg-white p-6 py-10 text-center text-xl font-semibold text-red-600 shadow-md">
        <p>Cricket Team with ID "{teamId}" not found.</p>
        <button className="mt-6 inline-block rounded-full bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600">
          Back to Cricket Teams List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-2xl">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900">{team.name}</h1>
        <p className="mb-6 text-lg text-gray-700">{team.description}</p>
        <div className="mb-8">
          <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-gray-800">
            Squad Players ({team.players})
          </h2>
          {team.members && team.members.length > 0 ? (
            <ul className="list-none space-y-3">
              {team.members.map((player: any) => (
                <li
                  key={player.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm"
                >
                  <span className="text-lg font-medium text-gray-800">{player.name}</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-gray-600">
                    {player.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No players in this squad yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const CricketTeamCard = ({ team }: { team: TeamProps }) => {
  const { joinTeam, withdrawJoinRequest, loading, isAlreadyInTeam, isAlreadyRequested } =
    useTeamRequest(team, user);

  const teamSlug = getTeamUrl(team);
  const encodedSlug = encodeURIComponent(teamSlug);

  return (
    <div className="relative aspect-video h-full w-full overflow-hidden rounded-xl shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:border-blue-500 hover:shadow-2xl">
      <div
        style={{
          backgroundImage: `url(${team.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3, // 👈 control background image opacity here
        }}
        className="absolute inset-0 z-0 bg-black"
      ></div>
      <div className="relative z-10 flex flex-col items-start space-y-4 border-none p-6 dark:bg-black">
        {/* Team Icon/Placeholder */}
        <div className="flex-shrink-0 rounded-full shadow-lg">
          {team.logo === "" ? (
            <Trophy className="h-10 w-10 text-white" />
          ) : (
            <img src={team.logo} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
          )}
        </div>

        {/* Team Details */}
        <div className="flex-grow text-center">
          <Link href={`/teams/${encodedSlug}`}>
            <h3 className="mb-1 text-xl font-bold text-blue-400 hover:underline dark:text-blue-200">
              {team.name}
            </h3>
          </Link>
          {/* <p className="mb-3 text-sm text-gray-300">{team.description}</p> */}
          <div className="text-accent-foreground grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
            <p className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-purple-400" />{" "}
              {`${team.players.length} ${team.players.length > 1 ? "Members" : "Member"}`}
            </p>
            {typeof team.captain !== "string" && (
              <p className="flex items-center">
                <User className="mr-2 h-4 w-4 text-emerald-400" /> Captain:
                {team.captain.name}
              </p>
            )}
            <p className="flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-400" /> Type:
              {team.type}
            </p>
            {/* <p className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-orange-400" /> Wins: {team.win}
          </p>
          <p className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4 text-red-400" /> Losses:
            {team.losses}
          </p>*/}
            <p className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4 text-cyan-400" /> Established:
              {formatDate(new Date(team.createdAt), "yyyy-MM-dd")}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-10 right-4 flex-shrink-0">
          {isAlreadyRequested ? (
            <Button
              variant={"default"}
              onClick={withdrawJoinRequest}
              disabled={loading || !isAlreadyRequested}
              className={`inline-flex items-center rounded-full border-none bg-red-600 px-4 py-1.5 text-xs font-semibold text-white drop-shadow-lg hover:scale-105 hover:bg-red-600/80`}
            >
              {loading ? <Spinner /> : "cancel"}
            </Button>
          ) : (
            <Button
              variant={"default"}
              onClick={joinTeam}
              disabled={!team.isRecruiting || loading || isAlreadyInTeam || isAlreadyRequested}
              className={`inline-flex items-center rounded-full border-none px-4 py-1.5 text-xs font-semibold shadow-md hover:scale-105 hover:shadow-xl ${team.isRecruiting ? "bg-main hover:bg-hover active:bg-active text-white" : "bg-purple-600 text-white"}`}
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
    </div>
  );
};
