import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Team, User } from "@/generated/prisma";
import { TeamWithPlayers } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Check, Loader2, Plus, Search, Shield, Trophy, Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AskToJoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const AskToJoinTeamModal = ({ user, isOpen, onClose }: AskToJoinTeamModalProps) => {
  const { data: teams, isLoading } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/teams/owned");
      return data.data;
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-full max-h-[78vh] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-[poppins] text-2xl font-black tracking-tight uppercase">
            Invite to Team
          </DialogTitle>
          <DialogDescription className="font-[poppins]">Select a team to invite</DialogDescription>
        </DialogHeader>

        <AskToJoinTeam teams={teams} user={user} />

        <DialogFooter>
          <div className="rounded-xl border-t border-slate-100 bg-slate-200 p-4 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center justify-end text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              {/* <span>Manage your squads</span> */}

              <Link
                className="border-input tracking-tigher flex items-center gap-1 rounded-xl border bg-white px-4 py-2 font-[urbanist] text-xs text-green-500 transition-colors hover:text-green-600 hover:opacity-80 dark:bg-slate-800"
                href={"/teams/create"}
              >
                Create New <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface JoinTheirTeamProps {}

export const JoinTheirTeamModal = ({}: JoinTheirTeamProps) => {
  return <div>JoinTheirTeamModal</div>;
};

interface AskToJoinTeamProps {
  user: User;
  teams: TeamWithPlayers[];
}

const AskToJoinTeam = ({ user, teams }: AskToJoinTeamProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const invitedTeams = teams.filter((team) => {
    return team.players.some((p) => p.user.username === user.username);
  });

  console.log(invitedTeams);

  const handleInvite = (id: string) => {};

  const loading = false;

  const invitingId = "";

  return (
    <div className="hide_scrollbar max-h-[45vh] overflow-hidden overflow-x-hidden overflow-y-auto pb-8">
      <ul className="custom-scrollbar max-h-[400px] space-y-3 overflow-y-auto p-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
            <Spinner className="h-8 w-8 animate-spin text-green-500" />
            <p className="text-xs font-bold tracking-widest uppercase">Accessing Team Database</p>
          </div>
        ) : teams.length > 0 ? (
          teams.map((team) => (
            <li
              key={team.id}
              className="group hover-card flex items-center gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/5"
            >
              {/* Team Logo */}
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-sm dark:border-slate-900 dark:bg-slate-800">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-slate-400">{team.abbreviation}</span>
                  )}
                </div>
                <div className="absolute -top-1 -left-1 rounded-lg bg-green-500 p-1 text-white shadow-lg">
                  <Shield className="h-2.5 w-2.5" />
                </div>
              </div>

              {/* Team Info */}
              <div className="min-w-0 flex-1">
                <h4 className="primary-text truncate font-sans text-sm font-black uppercase">
                  {team.name}
                </h4>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="secondary-text rounded-md bg-slate-200 px-1.5 py-0.5 font-[urbanist] text-[10px] font-black dark:bg-white/10">
                    {team.abbreviation}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                    <Users className="h-3 w-3" />
                    {team.players.length} Members
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={invitedTeams.findIndex((t) => t.id === team.id) === -1}
                onClick={() => handleInvite(team.id)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 ${
                  invitedTeams.findIndex((t) => t.id === team.id)
                    ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                    : "border border-slate-200 bg-white text-slate-400 group-hover:bg-green-50 hover:border-green-500 hover:text-green-500 dark:border-white/10 dark:bg-slate-800"
                }`}
              >
                {invitingId === team.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : invitedTeams.findIndex((t) => t.id === team.id) !== -1 ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </button>
            </li>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
              <Trophy className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              No Managed Teams Found
            </p>
          </div>
        )}
      </ul>
    </div>
  );
};
