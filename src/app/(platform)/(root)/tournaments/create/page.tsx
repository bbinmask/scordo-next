"use client";

import Spinner from "@/components/Spinner";

import { DollarSign, Info, Plus, Rocket, Settings2, Shield, Trophy } from "lucide-react";
import { useState } from "react";

const CreateTournamentPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    maxTeams: 16,
    matchesPerTeam: 3,
    totalOvers: 20,
    minAge: 18,
    winnerPrice: 0,
    entryFee: 0,
    halfBoundary: false,
    rules: [""],
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  };

  const addRule = () => setFormData((prev) => ({ ...prev, rules: [...prev.rules, ""] }));

  return (
    <div className="animate-in slide-in-from-bottom-6 min-h-screen bg-slate-50 p-4 duration-700 md:p-8 dark:bg-[#020617]">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h2 className="mb-2 text-[10px] font-black tracking-[0.5em] text-indigo-500 uppercase">
            Protocol Initialization
          </h2>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
            Create <span className="text-indigo-500">Circuit</span>
          </h1>
        </header>

        <form onSubmit={handleCreate} className="space-y-8">
          {/* Section: Core Identity */}
          <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10 dark:border-white/10 dark:bg-slate-900">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Shield size={120} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                  <Info size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic dark:text-white">
                  Tournament Identity
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Official Title
                  </label>
                  <input
                    required
                    placeholder="e.g. Scordo Premier League Season 4"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-lg font-black tracking-tight italic transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/5 dark:bg-slate-950 dark:text-white"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Format (Overs)
                    </label>
                    <select className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 dark:border-white/5 dark:bg-slate-950 dark:text-white">
                      <option value="10">T10 Sprint</option>
                      <option value="20" defaultValue="20">
                        T20 Professional
                      </option>
                      <option value="50">ODI Classic</option>
                      <option value="100">Test Duration</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Team Capacity
                    </label>
                    <input
                      type="number"
                      defaultValue={16}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 font-bold dark:border-white/5 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Financials & Incentives */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                  <DollarSign size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic dark:text-white">
                  Commercials
                </h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Entry Fee (per team)
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-6 pl-10 font-black outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/5 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Winner Grand Prize
                  </label>
                  <div className="relative">
                    <Trophy
                      className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-500"
                      size={16}
                    />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-6 pl-10 font-black outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/5 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
                  <Settings2 size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic dark:text-white">
                  Ruleset
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-xs font-black text-white">
                      ½
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Half-Boundary Protocol
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, halfBoundary: !formData.halfBoundary })
                    }
                    className={`relative h-6 w-10 rounded-full transition-colors ${formData.halfBoundary ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-800"}`}
                  >
                    <div
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${formData.halfBoundary ? "left-5" : "left-1"}`}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addRule}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-all hover:text-indigo-500 dark:border-white/10"
                >
                  <Plus size={14} /> Add Tournament Rule
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
            <p className="max-w-sm font-sans text-[9px] leading-relaxed font-medium text-slate-400 uppercase">
              By initializing this circuit, you are establishing the official Scordo Match Engine
              protocols for all participating rosters.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-emerald-600 px-16 py-5 text-xs font-black tracking-widest text-white uppercase shadow-2xl shadow-emerald-500/30 transition-all hover:bg-emerald-500 active:scale-95 md:w-auto"
            >
              {loading ? <Spinner /> : <Rocket size={20} />}
              {loading ? "Loading..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentPage;
