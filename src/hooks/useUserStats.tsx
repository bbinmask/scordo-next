"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { InningBattingDetails, InningBowlingDetails } from "@/lib/types";

export const useUserBattingStats = (userId: string) =>
  useQuery<InningBattingDetails[]>({
    queryKey: ["batting-stats", userId],
    queryFn: async () => {
      const res = await userService.getBattingStats(userId);
      return res.success ? (res.data ?? []) : [];
    },
  });

export const useUserBowlingStats = (userId: string) =>
  useQuery<InningBowlingDetails[]>({
    queryKey: ["bowling-stats", userId],
    queryFn: async () => {
      const res = await userService.getBowlingStats(userId);
      return res.success ? (res.data ?? []) : [];
    },
  });
