"use client";

import React, { ChangeEvent, useState } from "react";
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
} from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateMatch } from "@/actions/match-actions/schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { TeamRequestWithDetails } from "@/lib/types";
import axios from "axios";
import { Team } from "@/generated/prisma";
import { debounce } from "lodash";
type MatchCategory = "t20" | "odi" | "test" | "others";

interface VenueAddress {
  city: string;
  state: string;
  country: string;
}

interface MatchFormData {
  teamAId: string;
  teamBId: string;
  tournamentId?: string;
  overs: number;
  overLimit: number;
  venue: VenueAddress;
  category: MatchCategory;
  date: string;
  location: string;
}

const CreateMatchForm: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getFieldState,
    getValues,
    setValue,
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
      date: new Date(),
      location: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["my-teams"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/teams/owned");

      return data.data;
    },
  });

  const [query, setQuery] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [teamBName, setTeamBName] = useState("");
  const [opponentTeams, setOpponentTeams] = useState<Team[]>([]);

  const onSubmit: SubmitHandler<z.infer<typeof CreateMatch>> = async (data) => {
    setLoading(true);
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectTeamB = (teamId: string, name: string) => {
    setValue("teamBId", teamId);
    setShowPopover(false);
    setTeamBName(name);
    setQuery("");
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowPopover(true);

    if (value.trim().length === 0) return;

    debounce(async () => {
      const { data } = await axios.get(`/api/search/teams?query=${query}`);

      setOpponentTeams(data.data);
    }, 500)();
  };

  const getTeamA = (id?: string): Team | null =>
    id ? (teams?.find((t) => t.id === id) ?? null) : null;
  const getTeamB = (id?: string): Team | null =>
    id ? (opponentTeams?.find((t) => t.id === id) ?? null) : null;

  console.log(errors);

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
                  {getTeamA(getValues("teamAId"))?.logo ? (
                    <img
                      src={getTeamA(getValues("teamAId"))?.logo as string}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                >
                  <option value="">Select Your Team</option>
                  {teams
                    ?.filter((t) => t.id !== getValues("teamBId"))
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
                  {getTeamB(getValues("teamBId"))?.logo ? (
                    <img
                      src={getTeamB(getValues("teamBId"))?.logo as string}
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
                    onFocus={() => setShowPopover(true)}
                    value={teamBName || query}
                    onChange={handleQueryChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                  />
                </div>

                {/* Search Popover */}

                {query.trim().length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-2 scrollbar-hide absolute top-full left-0 z-[200] mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl duration-200 dark:border-white/10 dark:bg-slate-900/95">
                    {opponentTeams?.length > 0 ? (
                      opponentTeams.map((team) => (
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
                        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                          No Teams Found
                        </p>
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
                        <option value="t10">T10 Professional</option>
                        <option value="t20">T20 Professional</option>
                        <option value="odi">One Day International (ODI)</option>
                        <option value="test">Test Match</option>
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
