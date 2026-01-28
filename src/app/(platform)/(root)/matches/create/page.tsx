"use client";

import React, { useState } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  Activity,
  ChevronRight,
  Shield,
  Clock,
  Plus,
  X,
  Target,
  Flag,
  Save,
  Trash2,
  Settings2,
  Building,
  ShieldAlert,
  Loader2,
} from "lucide-react";

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
  const [formData, setFormData] = useState<MatchFormData>({
    teamAId: "",
    teamBId: "",
    tournamentId: "",
    overs: 20,
    overLimit: 4,
    venue: { city: "", state: "", country: "" },
    category: "others",
    date: new Date().toISOString().split("T")[0],
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const mockTeams = [
    {
      id: "t1",
      name: "Apex Sentinels",
      abbr: "AS",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=apex",
    },
    {
      id: "t2",
      name: "Shadow Realm",
      abbr: "SR",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=shadow",
    },
    {
      id: "t3",
      name: "Neon Knights",
      abbr: "NK",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=neon",
    },
    {
      id: "t4",
      name: "Void Walkers",
      abbr: "VW",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=void",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("venue.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        venue: { ...prev.venue, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting to Scordo API:", formData);
    setTimeout(() => {
      setLoading(false);
      console.log("Match Initialization Successful!");
    }, 1500);
  };

  const getTeam = (id: string) => mockTeams.find((t) => t.id === id);

  return (
    <div className={`transition-colors duration-500`}>
      <div className="rounded-4xl bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-[#020617] dark:text-slate-100">
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

          <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            {/* Visual Team VS Selection Area */}
            <div className="hover-card relative grid grid-cols-1 items-center gap-6 overflow-hidden rounded-[3rem] p-8 shadow-2xl shadow-black/80 md:grid-cols-3">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5" />

              {/* Team A */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl md:h-32 md:w-32 dark:border-slate-950 dark:bg-slate-800">
                  {getTeam(formData.teamAId)?.logo ? (
                    <img
                      src={getTeam(formData.teamAId)?.logo}
                      className="h-full w-full object-cover"
                      alt="Team A"
                    />
                  ) : (
                    <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <select
                  name="teamAId"
                  required
                  value={formData.teamAId}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                >
                  <option value="">Select Team A</option>
                  {mockTeams
                    .filter((t) => t.id !== formData.teamBId)
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
                  {getTeam(formData.teamBId)?.logo ? (
                    <img
                      src={getTeam(formData.teamBId)?.logo}
                      className="h-full w-full object-cover"
                      alt="Team B"
                    />
                  ) : (
                    <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <select
                  name="teamBId"
                  required
                  value={formData.teamBId}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold tracking-tight uppercase transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                >
                  <option value="">Select Team B</option>
                  {mockTeams
                    .filter((t) => t.id !== formData.teamAId)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
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
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-950"
                      >
                        <option value="others">Custom / Others</option>
                        <option value="t20">T20 Professional</option>
                        <option value="odi">One Day International (ODI)</option>
                        <option value="test">Test Match</option>
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
                            type="number"
                            name="overs"
                            required
                            min={1}
                            value={formData.overs}
                            onChange={handleInputChange}
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
                            type="number"
                            name="overLimit"
                            required
                            min={formData.overs / 4}
                            value={formData.overLimit}
                            onChange={handleInputChange}
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
                          name="tournamentId"
                          value={formData.tournamentId}
                          onChange={handleInputChange}
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
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Stadium / Ground Name
                      </label>
                      <div className="relative">
                        <Building className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Lord's Cricket Ground"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          name="venue.city"
                          required
                          value={formData.venue.city}
                          onChange={handleInputChange}
                          placeholder="London"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="mb-1 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Country
                        </label>
                        <input
                          type="text"
                          name="venue.country"
                          required
                          value={formData.venue.country}
                          onChange={handleInputChange}
                          placeholder="United Kingdom"
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
