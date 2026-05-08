"use client";

import { useQuery } from "@tanstack/react-query";
import { matchService } from "@/services/match.service";
import type { CurrentOverBalls, InningDetails } from "@/lib/types";

export const useCurrentOverBalls = (inningId?: string) =>
  useQuery<CurrentOverBalls[]>({
    queryKey: ["current-over", inningId],
    queryFn: async () => {
      if (!inningId) return [];
      const res = await matchService.getCurrentOverBalls(inningId);
      return res.success ? (res.data ?? []) : [];
    },
    enabled: Boolean(inningId),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

export const useMatchTarget = (matchId: string) =>
  useQuery<string | null>({
    queryKey: ["match-target", matchId],
    queryFn: async () => {
      const res = await matchService.getTarget(matchId);
      return res.success ? (res.data ?? null) : null;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

export const useMyMatches = () =>
  useQuery({
    queryKey: ["my-matches"],
    queryFn: async () => {
      const res = await matchService.getMyMatches();
      return res.success ? (res.data ?? []) : [];
    },
  });

export const useMyOfficialMatches = () =>
  useQuery({
    queryKey: ["my-official-matches"],
    queryFn: async () => {
      const res = await matchService.getMyOfficialMatches();
      return res.success ? (res.data ?? []) : [];
    },
  });
