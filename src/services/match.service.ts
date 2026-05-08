import { apiFetch } from "./api.service";
import type { MatchWithDetails, InningDetails, CurrentOverBalls } from "@/lib/types";

export const matchService = {
  getMyMatches: () => apiFetch<MatchWithDetails[]>("/api/me/matches/"),

  getMyOfficialMatches: () => apiFetch<MatchWithDetails[]>("/api/me/matches/officials"),

  getMatch: (id: string) => apiFetch<MatchWithDetails>(`/api/matches/${id}`),

  getInnings: (matchId: string) => apiFetch<InningDetails[]>(`/api/matches/${matchId}/innings`),

  getCurrentOverBalls: (inningId: string) =>
    apiFetch<CurrentOverBalls[]>(`/api/matches/innings/${inningId}/balls/current-over`),

  getTarget: (matchId: string) => apiFetch<string | null>(`/api/matches/${matchId}/target`),
};
