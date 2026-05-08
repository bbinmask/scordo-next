"use client";

import { useCallback, useEffect, useState } from "react";
import useAxios from "./useAxios";
import { AxiosResponse } from "axios";
import { Team, User } from "@/generated/prisma";
import { useAsyncRunner } from "./useAsyncRunner";
import { teamService } from "@/services/team.service";

export const useTeam = () => {
  const { run, error, loading } = useAsyncRunner();
  // 1. Fetch all teams
  const fetchTeams = useCallback(
    () =>
      run(async () => {
        const res = await teamService.getAll();
        return res.success ? res.data : [];
      }),
    []
  );

  // 2. Get a single team.
  const getSingleTeam = useCallback(
    (abbr: string) =>
      run(async () => {
        const res = await teamService.getOne(abbr);
        return res.success ? res.data : null;
      }),
    []
  );

  // 3. Update a team
  const updateTeamById = useCallback(
    async (teamId: string, updates: Partial<Team>) =>
      run(async () => {
        const res = await teamService.update(teamId, updates);
        return res.success ? res.data : null;
      }),
    []
  );

  // 4 Search for teams
  const searchTeams = useCallback(
    async (query: string) =>
      run(async () => {
        const res = await teamService.search(query);
        return res.success ? res.data : [];
      }),
    []
  );

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
  const isCaptain = Boolean(userId && team && userId === team.captainId);
  return { isOwner, isCaptain };
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
