"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
import { createTournament } from "@/actions/tournament-actions";
import { CreateTournament } from "@/actions/tournament-actions/schema";
import Spinner from "@/components/Spinner";
import {
  Trophy,
  Calendar,
  MapPin,
  Settings2,
  Plus,
  Trash2,
  ShieldCheck,
  Coins,
  Users,
  Hash,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type FormValues = z.infer<typeof CreateTournament>;

// ── Shared input styles ─────────────────────────────────────────────────────
const INPUT =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-[urbanist] text-sm font-bold text-slate-800 outline-none transition-all placeholder:font-semibold placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";
const LABEL =
  "mb-1.5 block font-[poppins] text-[10px] font-black tracking-widest text-slate-400 uppercase";
const ERR = "mt-1.5 flex items-center gap-1 font-[urbanist] text-xs font-semibold text-rose-500";

// ── Section header ──────────────────────────────────────────────────────────
const Section = ({
  icon: Icon,
  title,
  color = "emerald",
  children,
}: {
  icon: any;
  title: string;
  color?: string;
  children: React.ReactNode;
}) => (
  <div className="hover-card overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-slate-900/50">
    <div className="mb-6 flex items-center gap-3">
      <div className={`rounded-xl bg-${color}-500/10 p-2 text-${color}-500`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-[poppins] text-lg font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default function CreateTournamentPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(CreateTournament),
    defaultValues: {
      totalOvers: 20,
      maxTeams: 8,
      matchesPerTeam: 3,
      halfBoundary: false,
      rules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  const [ruleInput, setRuleInput] = useState("");

  const { execute, isLoading } = useAction(createTournament, {
    onSuccess() {
      toast.success("Tournament created!");
    },
    onError(err) {
      toast.error(err);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    execute(data);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-32 font-sans transition-colors dark:bg-[#020617]">
      <div className="mx-auto -mt-4 max-w-4xl space-y-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-[urbanist] text-xs font-semibold text-slate-400">
          <Link href="/tournaments" className="transition-colors hover:text-green-500">
            Tournaments
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-300">Create</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ── Basic Info ─────────────────────────────────────────────── */}
          <Section icon={Trophy} title="Basic Information">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={LABEL}>Tournament Title *</label>
                <input
                  {...register("title")}
                  className={INPUT}
                  placeholder="e.g. Scordo Premier League 2025"
                />
                {errors.title && (
                  <p className={ERR}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={LABEL}>Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className={`${INPUT} resize-none`}
                  placeholder="Brief description of the tournament…"
                />
              </div>

              <div>
                <label className={LABEL}>Start Date *</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="date" {...register("startDate")} className={`${INPUT} pl-10`} />
                </div>
                {errors.startDate && (
                  <p className={ERR}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className={LABEL}>End Date *</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="date" {...register("endDate")} className={`${INPUT} pl-10`} />
                </div>
                {errors.endDate && (
                  <p className={ERR}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </Section>

          {/* ── Format ─────────────────────────────────────────────────── */}
          <Section icon={Settings2} title="Match Format">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              <div>
                <label className={LABEL}>Total Overs *</label>
                <div className="relative">
                  <Hash className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={100}
                    {...register("totalOvers", { valueAsNumber: true })}
                    className={`${INPUT} pl-10`}
                  />
                </div>
                {errors.totalOvers && (
                  <p className={ERR}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.totalOvers.message}
                  </p>
                )}
              </div>

              <div>
                <label className={LABEL}>Max Teams *</label>
                <div className="relative">
                  <Users className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={2}
                    max={64}
                    {...register("maxTeams", { valueAsNumber: true })}
                    className={`${INPUT} pl-10`}
                  />
                </div>
                {errors.maxTeams && (
                  <p className={ERR}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.maxTeams.message}
                  </p>
                )}
              </div>

              <div>
                <label className={LABEL}>Matches / Team *</label>
                <input
                  type="number"
                  min={1}
                  {...register("matchesPerTeam", { valueAsNumber: true })}
                  className={INPUT}
                />
                {errors.matchesPerTeam && (
                  <p className={ERR}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.matchesPerTeam.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-end">
                <label className={LABEL}>Half Boundary</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-900">
                  <input
                    type="checkbox"
                    {...register("halfBoundary")}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  <span className="font-[urbanist] text-sm font-bold text-slate-600 dark:text-slate-300">
                    Enable half boundary (only 4s allowed)
                  </span>
                </label>
              </div>

              <div>
                <label className={LABEL}>Min Age</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Optional"
                  {...register("minAge", { valueAsNumber: true })}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Max Age</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Optional"
                  {...register("maxAge", { valueAsNumber: true })}
                  className={INPUT}
                />
              </div>
            </div>
          </Section>

          {/* ── Prizes & Fees ───────────────────────────────────────────── */}
          <Section icon={Coins} title="Prizes & Fees" color="amber">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className={LABEL}>Winner Prize (₹)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("winnerPrice", { valueAsNumber: true })}
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Runner-up Prize (₹)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("runnerUpPrice", { valueAsNumber: true })}
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Entry Fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0 = Free"
                  {...register("entryFee", { valueAsNumber: true })}
                  className={INPUT}
                />
              </div>
            </div>
          </Section>

          {/* ── Location ───────────────────────────────────────────────── */}
          <Section icon={MapPin} title="Location" color="blue">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className={LABEL}>City</label>
                <input {...register("location.city")} className={INPUT} placeholder="Mumbai" />
              </div>
              <div>
                <label className={LABEL}>State</label>
                <input
                  {...register("location.state")}
                  className={INPUT}
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <label className={LABEL}>Country</label>
                <input {...register("location.country")} className={INPUT} placeholder="India" />
              </div>
            </div>
          </Section>

          {/* ── Rules ──────────────────────────────────────────────────── */}
          <Section icon={ShieldCheck} title="Tournament Rules" color="indigo">
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (ruleInput.trim()) {
                      append(ruleInput.trim() as any);
                      setRuleInput("");
                    }
                  }
                }}
                className={`${INPUT} flex-1`}
                placeholder="Type a rule and press Enter or click Add…"
              />
              <button
                type="button"
                onClick={() => {
                  if (ruleInput.trim()) {
                    append(ruleInput.trim() as any);
                    setRuleInput("");
                  }
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-3 font-[urbanist] text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-95"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {fields.length > 0 ? (
              <ul className="space-y-2">
                {fields.map((field, i) => (
                  <li
                    key={field.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-white/5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-[poppins] text-[10px] font-black text-emerald-500">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-[urbanist] text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {/* @ts-ignore */}
                      {field as unknown as string}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="rounded-lg p-1.5 text-slate-300 transition-all hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center dark:border-white/10">
                <p className="font-[urbanist] text-xs font-semibold text-slate-400">
                  No rules added yet. Press Enter or click Add to add a rule.
                </p>
              </div>
            )}
          </Section>

          {/* ── Actions ────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-end gap-4 pb-8 md:flex-row">
            <Link
              href="/tournaments"
              className="w-full rounded-2xl px-8 py-4 text-center font-[urbanist] text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200 md:w-auto dark:hover:bg-white/5"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-12 py-4 font-[urbanist] text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50 md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4" /> Launch Tournament
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
