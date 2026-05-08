import { apiFetch } from "./api.service";
import type { InningBattingDetails, InningBowlingDetails } from "@/lib/types";

export const userService = {
  getBattingStats: (userId: string) =>
    apiFetch<InningBattingDetails[]>(`/api/stats/user/batting?userId=${userId}`),

  getBowlingStats: (userId: string) =>
    apiFetch<InningBowlingDetails[]>(`/api/stats/user/bowling?userId=${userId}`),

  getProfile: () => apiFetch("/api/u/profile"),

  getFriendStatus: (userId: string) => apiFetch(`/api/u/friends/${userId}/status`),
};
