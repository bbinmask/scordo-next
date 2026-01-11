import Spinner from "@/components/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Team, User } from "@/generated/prisma";
import { TeamWithPlayers } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Check, Loader2, Plus, Search, Shield, Trophy, Users, X } from "lucide-react";
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

      console.log(data?.data);

      return data.data;
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teams</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <AskToJoinTeam teams={teams} user={user} />
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
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const invitedTeams = [teams[0]];

  const handleInvite = (id: string) => {};

  const [searchQuery, setSearchQuery] = useState("");

  const loading = false;

  const invitingId = "";

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white font-sans shadow-2xl dark:border-white/10 dark:bg-slate-900">
      {/* Header */}
      <div className="p-8 pb-4">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase dark:text-white">
              Invite to Team
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Select a team to invite
              <span className="ml-1 font-bold text-indigo-500">{user.username}</span>
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="group relative">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="Search your teams..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm transition-all focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:border-white/5 dark:bg-slate-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Teams List */}
      <div className="px-4 pb-8">
        <ul className="custom-scrollbar max-h-[400px] space-y-2 overflow-y-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
              <Spinner className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-xs font-bold tracking-widest uppercase">Accessing Team Database</p>
            </div>
          ) : filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <li
                key={team.id}
                className="group flex items-center gap-4 rounded-3xl border border-transparent p-4 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/5"
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
                  <div className="absolute -top-1 -left-1 rounded-lg bg-indigo-500 p-1 text-white shadow-lg">
                    <Shield className="h-2.5 w-2.5" />
                  </div>
                </div>

                {/* Team Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold tracking-tighter text-slate-900 uppercase dark:text-white">
                    {team.name}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-black text-slate-500 dark:bg-white/10 dark:text-slate-400">
                      {team.abbreviation}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                      <Users className="h-3 w-3" />
                      {team.players?._count as string} Members
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
                      : "border border-slate-200 bg-white text-slate-400 group-hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-500 dark:border-white/10 dark:bg-slate-800"
                  }`}
                >
                  {invitingId === team.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : invitedTeams.findIndex((t) => t.id === team.id) ? (
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

      {/* Footer Info */}
      <div className="border-t border-slate-100 bg-slate-50 p-6 dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          <span>Manage your squads</span>
          <button className="flex items-center gap-1 text-indigo-500 transition-colors hover:text-indigo-600">
            Create New <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
