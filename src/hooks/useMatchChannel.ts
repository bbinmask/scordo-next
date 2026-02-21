"use client";

import { useEffect } from "react";
import { useChannel } from "ably/react";
import { useQueryClient } from "@tanstack/react-query";

export const useMatchChannel = (matchId: string, inningId?: string) => {
  const queryClient = useQueryClient();

  useChannel(`match:${matchId}`, "ball-updated", () => {
    queryClient.invalidateQueries({ queryKey: ["match", matchId] });

    if (inningId) {
      queryClient.invalidateQueries({
        queryKey: ["current-over-history", inningId],
      });
    }

    queryClient.invalidateQueries({ queryKey: ["runs-left", matchId] });
  });
};
