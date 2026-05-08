import { TeamForListComponent, TeamWithPlayers } from "@/lib/types";
import { apiFetch } from "./api.service";

export const teamService = {
  getAll: () => apiFetch<TeamForListComponent[]>("/api/teams"),

  getOne: (abbr: string) => apiFetch<TeamWithPlayers>(`/api/teams/${abbr}`),

  update: (abbr: string, updates: Record<string, unknown>) =>
    apiFetch(`/api/teams/${abbr}`, "PUT", updates),

  joinRequest: (abbr: string) => apiFetch(`/api/teams/join-request/${abbr}`, "POST"),

  withdrawRequest: (abbr: string) => apiFetch(`/api/teams/withdraw-request/${abbr}`, "POST"),

  leaveTeam: (abbr: string) => apiFetch(`/api/teams/leave-team/${abbr}`, "POST"),

  getRequests: (abbr: string) => apiFetch(`/api/teams/${abbr}/requests`),
  search: (query: string) => apiFetch<TeamForListComponent[]>(`/api/teams/search?query=${query}`),
};
