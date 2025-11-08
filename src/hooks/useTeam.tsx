"use client";

import { useCallback, useEffect, useState } from "react";
import useAxios from "./useAxios";
import { AxiosResponse } from "axios";
import { Team, User } from "@/generated/prisma";

export const useTeam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchData } = useAxios();
  // 1. Fetch all teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res: AxiosResponse = await fetchData("/teams");
      if (res?.data?.success) {
        return res.data.data as Team[];
      } else {
        return;
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch teams.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Get a single team.
  const getSingleTeam = useCallback(async (username: string) => {
    try {
      setLoading(true);
      setError(null);

      const res: AxiosResponse = await fetchData(`/teams/${username}`);
      if (res?.data?.success) {
        return res.data.data as Team;
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch teams.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Update a team
  const updateTeamById = useCallback(async (teamId: string, updates: Partial<Team>) => {
    try {
      setLoading(true);
      setError(null);
      const res: AxiosResponse = await fetchData(`/teams/${teamId}`, "PUT", updates);
      if (res?.data?.success) {
        return res.data.data;
      } else return res?.data.success;
    } catch (err: any) {
      setError(err.message || "Failed to fetch teams.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 4 Search for teams
  const searchTeams = useCallback(async (query: string) => {
    if (!query || query.trim() === "") return;

    try {
      setLoading(true);
      const res: AxiosResponse = await fetchData(`/teams/search?query=${query}`);
      if (res?.data?.success) {
        return res.data.data as Team[];
      } else {
        return [];
      }
    } catch (error: any) {
      console.error(error?.message);
      setError(error.message || "Couldn't find any team");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchTeams,
    getSingleTeam,
    updateTeamById,
    searchTeams,
  };
};

export const useIsTeamOwner = (team: Team, userId?: string) => {
  const isOwner = Boolean(userId && team && userId === team.ownerId);
  return { isOwner };
};

export const useTeamRequest = (team: Team, user?: User) => {
  const { fetchData } = useAxios();
  const [isAlreadyRequested, setIsAlreadyRequested] = useState(false);
  const [isAlreadyInTeam, setIsAlreadyInTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!team || !user) return;
  //   const isInTeam = team.players.some((p) => String(p.id) === String(user.id));
  //   const isRequested = team.pendingRequests?.some(
  //     (p) => typeof p !== "string" && String(p.id) === String(user.id)
  //   );
  //   setIsAlreadyInTeam(isInTeam);
  //   setIsAlreadyRequested(isRequested);
  // }, [team, user]);

  const runRequest = async (fn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = () =>
    runRequest(() => fetchData(`/teams/join-request/${team.abbreviation}`, "POST"));

  const withdrawJoinRequest = () =>
    runRequest(() => fetchData(`/teams/withdraw-request/${team.abbreviation}`, "POST"));

  const leaveTeam = () =>
    runRequest(() => fetchData(`/teams/leave-team/${team.abbreviation}`, "POST"));

  return {
    isAlreadyInTeam,
    isAlreadyRequested,
    joinTeam,
    withdrawJoinRequest,
    leaveTeam,
    loading,
    error,
  };
};

export const useHandleRequest = () => {
  const handleAcceptRequest = async () => {
    return true;
  };
  const handleRejectRequest = async () => {
    return true;
  };

  return { handleRejectRequest, handleAcceptRequest };
};
