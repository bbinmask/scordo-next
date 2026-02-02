"use client";

import React, { ChangeEvent, ComponentRef, Ref, useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  Shield,
  Plus,
  Target,
  Settings2,
  Building,
  ShieldAlert,
  Loader2,
  Search,
  Check,
  Gavel,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateMatch } from "@/actions/match-actions/schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PlayerWithUser, TeamWithPlayers } from "@/lib/types";
import axios from "axios";
import { OfficialRole, User } from "@/generated/prisma";
import { debounce } from "lodash";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { useAction } from "@/hooks/useAction";
import { createMatch } from "@/actions/match-actions";

const CreateMatchForm: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm<z.infer<typeof CreateMatch>>({
    resolver: zodResolver(CreateMatch),
    defaultValues: {
      teamAId: "",
      teamBId: "",
      tournamentId: "",
      overs: 20,
      overLimit: 4,
      venue: { city: "", state: "", country: "" },
      category: "others",
      location: "",
    },
  });

  const { execute } = useAction(createMatch, {
    onSuccess(data) {
      toast.success("Match is created!");
    },
    onError(error) {
      toast.error(error);
    },
  });
  const [loading, setLoading] = useState(false);

  const { data: teams } = useQuery<TeamWithPlayers[]>({
    queryKey: ["my-teams"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/teams/owned");

      return data.data;
    },
  });

  const [teamsLoading, setTeamsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showTeamPopover, setShowTeamPopover] = useState(false);
  const [teamBName, setTeamBName] = useState("");
  const [opponentTeams, setOpponentTeams] = useState<TeamWithPlayers[]>([]);
  const [selectedRole, setSelectedRole] = useState<OfficialRole>();
  const [selectedOfficial, setSelectedOfficial] = useState<PlayerWithUser>();
  const [players, setPlayers] = useState<PlayerWithUser[]>();

  const matchOfficials = watch("matchOfficials");

  const teamAId = watch("teamAId");
  const teamBId = watch("teamBId");

  const onSubmit: SubmitHandler<z.infer<typeof CreateMatch>> = async (data) => {
    execute(data);
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowTeamPopover(true);

    if (value.trim().length === 0) return;

    debouncedSearch(value);
  };

  const addOfficial = (userId: string, name: string) => {
    if (matchOfficials?.some((o) => o.userId === userId)) return;
    if (matchOfficials) {
      setValue("matchOfficials", [
        ...matchOfficials,
        { userId, name, role: selectedRole as OfficialRole },
      ]);
    } else {
      setValue("matchOfficials", [{ userId, name, role: selectedRole as OfficialRole }]);
    }
  };

  const removeOfficial = (userId: string) => {
    const currentOfficials = getValues("matchOfficials") ?? [];
    setValue(
      "matchOfficials",
      currentOfficials.filter((o) => o.userId !== userId)
    );
  };

  const selectTeamB = (teamId: string, name: string) => {
    setValue("teamBId", teamId);
    setShowTeamPopover(false);
    setTeamBName(name);
    setQuery("");
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (q: string) => {
        setTeamsLoading(true);
        try {
          const { data } = await axios.get(`/api/search/teams?query=${q}`);
          setOpponentTeams(data.data);
        } catch (error) {
          toast.error("Couldn't find teams!");
        } finally {
          setTeamsLoading(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    const teamA = getTeamA(teamAId)?.players || [];
    const teamB = getTeamB(teamBId)?.players || [];

    const teamAPlayers = [...teamA];
    const teamBPlayers = [...teamB];

    const uniquePlayers = Array.from(
      new Map([...teamAPlayers, ...teamBPlayers].map((p) => [p.userId, p])).values()
    );

    setPlayers(uniquePlayers);
  }, [teamAId, teamBId]);

  const getTeamA = (id?: string): TeamWithPlayers | null =>
    id ? (teams?.find((t) => t.id === id) ?? null) : null;
  const getTeamB = (id?: string): TeamWithPlayers | null =>
    id ? (opponentTeams?.find((t) => t.id === id) ?? null) : null;

  return (
    <div className={`transition-colors duration-500`}>
      <div className="bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-[#020617] dark:text-slate-100">
        <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-4xl space-y-8 duration-700">
          {/* Header */}
          <div className="text-center md:text-left">
            <h2 className="font-inter mb-2 text-sm font-black tracking-wider text-emerald-500 uppercase">
              Match Constructor
            </h2>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic md:text-5xl dark:text-white">
              Create New Match
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
            {/* Visual Team VS Selection Area */}
            <div className="hover-card relative grid grid-cols-1 items-center gap-6 rounded-[2rem] p-8 shadow-2xl shadow-black/80 md:grid-cols-3">
              {/* Team A */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl md:h-32 md:w-32 dark:border-slate-950 dark:bg-slate-800">
                  {getTeamA(teamAId)?.logo ? (
                    <img
                      src={getTeamA(teamAId)?.logo as string}
                      className="h-full w-full object-cover"
                      alt="Team A"
                    />
                  ) : (
                    <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <select
                  {...register("teamAId", { required: "Team A is required" })}
                  name="teamAId"
                  required
                  className="w-full truncate overflow-x-clip rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                >
                  <option value="">Select Your Team</option>
                  {teams
                    ?.filter((t) => t.id !== teamBId)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* VS Divider */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-xl font-black text-white italic shadow-lg shadow-emerald-600/40">
                  VS
                </div>
                <div className="mt-4 hidden h-px w-24 bg-slate-200 md:block dark:bg-white/10" />
              </div>

              {/* Team B */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl md:h-32 md:w-32 dark:border-slate-950 dark:bg-slate-800">
                  {getTeamB(teamBId)?.logo ? (
                    <img
                      src={getTeamB(teamBId)?.logo as string}
                      className="h-full w-full object-cover"
                      alt="Team B"
                    />
                  ) : (
                    <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Type team name..."
                    onFocus={() => setShowTeamPopover(true)}
                    value={teamBName || query}
                    onChange={handleQueryChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                  />
                </div>

                {/* Search Popover */}

                {showTeamPopover && (
                  <div className="animate-in fade-in slide-in-from-top-2 scrollbar-hide absolute top-full left-0 z-[200] mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl duration-200 dark:border-white/10 dark:bg-slate-900/95">
                    {opponentTeams?.length > 0 ? (
                      opponentTeams
                        .filter((team) => team.id !== teamAId)
                        .map((team) => (
                          <button
                            key={team.id}
                            type="button"
                            onClick={() => selectTeamB(team.id, team.name)}
                            className="group flex w-full items-center justify-between rounded-xl p-3 transition-all hover:bg-slate-100 dark:hover:bg-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                {team.logo ? (
                                  <img src={team.logo} className="h-full w-full object-cover" />
                                ) : (
                                  <Shield className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-black tracking-tighter text-slate-900 uppercase dark:text-white">
                                  {team.name}
                                </p>
                                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                                  {team.abbreviation}
                                </p>
                              </div>
                            </div>
                            {getValues("teamBId") === team.id && (
                              <Check className="h-4 w-4 text-emerald-500" />
                            )}
                          </button>
                        ))
                    ) : (
                      <div className="p-4 text-center">
                        {teamsLoading ? (
                          <Spinner className="h-min w-min" />
                        ) : (
                          <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                            No Teams Found
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Left Column: Match Logic */}
              <div className="space-y-6">
                <div className="hover-card rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-black/80 dark:border-white/10 dark:bg-slate-900">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                      <Settings2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-[poppins] text-xl font-black tracking-tighter uppercase italic">
                      Match Logic
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Match Category
                      </label>
                      <select
                        {...register("category", { required: "Category is required" })}
                        name="category"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-950"
                      >
                        <option value="T10">T10 Professional</option>
                        <option value="T20">T20 Professional</option>
                        <option value="ODI">One Day International (ODI)</option>
                        <option value="Test">Test Match</option>
                        <option value="others">Custom / Others</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Total Overs
                        </label>
                        <div className="relative">
                          <Target className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            {...register("overs", { required: "Overs required!" })}
                            type="number"
                            name="overs"
                            required
                            min={1}
                            placeholder="20"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-950"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Over Limit
                        </label>
                        <div className="relative">
                          <ShieldAlert className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            {...register("overLimit", { required: "Over-limit is required!" })}
                            type="number"
                            name="overLimit"
                            required
                            placeholder="4"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-950"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Player Limit
                      </label>
                      <div className="relative">
                        <Trophy className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          {...register("playerLimit", { required: "Player limit is required" })}
                          name="playerLimit"
                          placeholder="Enter limit of players in both team"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-950"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Tournament Association (Optional)
                      </label>
                      <div className="relative">
                        <Trophy className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          {...register("tournamentId", { validate: (v) => v?.toString() })}
                          name="tournamentId"
                          placeholder="Select Tournament or Paste ID"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Venue & Schedule */}
              <div className="space-y-6">
                <div className="hover-card rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-black/80 dark:border-white/10 dark:bg-slate-900">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="font-[poppins] text-xl font-black tracking-tighter uppercase italic">
                      Venue & Schedule
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Scheduled Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          {...register("date", { required: "Date is required!" })}
                          type="date"
                          name="date"
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {" "}
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Stadium / Ground Name
                        </label>
                        <div className="relative">
                          <Building className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            {...register("location", { required: "Location is required!" })}
                            type="text"
                            name="location"
                            required
                            placeholder="Chinnaswamy Stadium"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          {...register("venue.city", { required: "City is required!" })}
                          name="venue.city"
                          required
                          placeholder="Bengaluru"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          State
                        </label>
                        <input
                          type="text"
                          {...register("venue.state", { required: "State is required!" })}
                          name="venue.state"
                          required
                          placeholder="Karnataka"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Country
                        </label>
                        <input
                          type="text"
                          {...register("venue.country", { required: "Country is required!" })}
                          name="venue.country"
                          required
                          placeholder="India"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hover-card relative w-full overflow-visible rounded-[2.5rem] border p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                  <Gavel className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black tracking-tighter uppercase italic">
                  Match Officials
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Select Official
                    </label>
                    <div className="relative">
                      <select className="w-full truncate overflow-x-clip rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950">
                        <option value="">Select Official</option>

                        {players?.map((pl) => (
                          <option
                            key={pl.userId}
                            onClick={() => setSelectedOfficial(pl)}
                            className="flex w-full items-center justify-between rounded-lg p-2 text-[10px] font-black tracking-tighter text-slate-900 uppercase transition-all hover:bg-slate-100 dark:text-white dark:hover:bg-white/5"
                          >
                            {pl.user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="w-1/3">
                    <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Role
                    </label>
                    <select
                      onChange={(e) => {
                        setSelectedRole(e.target.value.toUpperCase() as OfficialRole);
                      }}
                      className="w-full truncate overflow-x-clip rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                    >
                      <option value="">Select Role</option>
                      <option value="umpire">Umpire</option>
                      <option value="commentator">Commentator</option>
                      <option value="scorer">Scorer</option>
                    </select>
                  </div>
                </div>

                {selectedOfficial && (
                  <button
                    type="button"
                    className="primary-btn rounded-xl px-8 py-2"
                    onClick={() => addOfficial(selectedOfficial.userId, selectedOfficial.user.name)}
                  >
                    Add
                  </button>
                )}

                {/* Active Officials List */}
                <div className="mt-4 space-y-2">
                  {matchOfficials && matchOfficials.length > 0 ? (
                    matchOfficials.map((official) => (
                      <div
                        key={official.userId}
                        className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black tracking-tighter text-slate-900 uppercase dark:text-white">
                              {official?.name}
                            </p>
                            <p className="text-[8px] font-bold tracking-[0.2em] text-emerald-500 uppercase">
                              {official.role.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOfficial(official.userId)}
                          className="rounded-lg p-2 text-red-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 py-4 text-center dark:border-white/10">
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        No Officials Assigned
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Form Actions */}
            <div className="flex flex-col items-center justify-end gap-4 pt-4 md:flex-row">
              <button
                type="button"
                className="w-full rounded-2xl px-8 py-4 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200 md:w-auto dark:hover:bg-white/5"
              >
                Discard Fixture
              </button>
              <button
                disabled={loading}
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-12 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50 md:w-auto"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {loading ? "Constructing..." : "Initialize Scordo Match"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMatchForm;
