"use client";

import { useCallback, useEffect, useState } from "react";
import useAxios from "./useAxios";
import TeamProps from "@/types/teams.props";
import { user } from "@/constants";

export const useTeam = () => {
  const [teams, setTeams] = useState<TeamProps[]>();
  const [team, setTeam] = useState<TeamProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAlreadyRequested, setIsAlreadyRequested] = useState(false);
  const [isAlreadyInTeam, setIsAlreadyInTeam] = useState(false);

  const { fetchData } = useAxios();
  // 1. Fetch all teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchData("/teams");
      if (res?.success) {
        setTeams(res.data);
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

      const res = await fetchData(`/teams/${username}`);
      if (res?.success) {
        setTeam(res.data.team as TeamProps);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Failed to fetch teams.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Update a team
  const updateTeamById = useCallback(async (teamId: string, updates: Partial<TeamProps>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchData(`/teams/${teamId}`, "PUT", updates);
      console.log(res);
      if (res?.success) {
        setTeam(res.data.team);
      }
      return res?.success;
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
      const res = await fetchData(`/teams/search?query=${query}`);
      console.log(res);
      if (res?.success) {
        setTeams(res.data.teams);
      } else {
        setTeams([]);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const joinTeam = useCallback(async () => {
    if (!team || !user) {
      throw new Error(" JOin team error");
    }

    try {
      setLoading(true);
      const res = await fetchData(`/teams/join-request/${team.abbreviation}`, "POST");

      if (res.success) {
        setIsAlreadyRequested(true);
      } else {
      }
    } catch (error: any) {
      console.error("Join request error:", error);
    } finally {
      setLoading(false);
    }
  }, [team, user]);

  const withdrawRequest = useCallback(async () => {
    if (!team || !user) {
    }

    try {
      setLoading(true);
      const res = await fetchData(`/teams/withdraw-request/${team?.abbreviation}`, "POST");

      if (res.success) {
        setIsAlreadyRequested(false);
      } else {
      }
    } catch (error: any) {
      console.error("Remove request error:", error);
    } finally {
      setLoading(false);
    }
  }, [team, user]);

  const leaveTeam = useCallback(async () => {
    if (!team || !user) {
    }

    try {
      setLoading(true);
      const res = await fetchData(`/teams/leave-team/${team?.abbreviation}`, "POST");

      if (res.success) {
        setIsAlreadyInTeam(false);
      } else {
      }
    } catch (error: any) {
      console.error("Remove request error:", error);
    } finally {
      setLoading(false);
    }
  }, [team, user]);

  useEffect(() => {
    if (!user || !team) return;
    if (typeof team?.owner !== "object") {
      setIsOwner(user?._id?.toString() === team?.owner.toString());
    } else {
      setIsOwner(user?._id?.toString() === team?.owner?.id?.toString());
    }
  }, [team, user]);

  return {
    teams,
    team,
    loading,
    error,
    fetchTeams,
    getSingleTeam,
    updateTeamById,
    setTeam,
    searchTeams,
    isOwner,
    isAlreadyInTeam,
    leaveTeam,
    withdrawRequest,
    isAlreadyRequested,
    joinTeam,
  };
};
