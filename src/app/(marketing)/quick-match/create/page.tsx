"use client";

import { useRouter } from "next/navigation";
import {
  useFieldArray,
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useState } from "react";
import {
  Shield,
  Plus,
  Trash2,
  Target,
  ShieldAlert,
  MapPin,
  Calendar,
  Settings2,
  Trophy,
  ArrowRight,
  Loader2,
  Fingerprint,
} from "lucide-react";
import { saveQuickMatch } from "@/lib/match/quick-match-storage";
import type { QuickMatch, QuickTeam } from "@/types/quick-match.props";

const playerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const quickMatchSchema = z.object({
  teamAName: z.string().min(2, "Team A name is required"),
  teamBName: z.string().min(2, "Team B name is required"),
  teamAPlayers: z.array(playerSchema).min(2, "Add at least 2 players"),
  teamBPlayers: z.array(playerSchema).min(2, "Add at least 2 players"),
  overs: z.number({ error: "Enter overs" }).min(1).max(50),
  overLimit: z.number({ error: "Enter over limit" }).min(1),
  playerLimit: z.number({ error: "Enter player limit" }).min(2).max(15),
  category: z.enum(["T10", "T20", "ODI", "Test", "others"]),
  location: z.string().min(1, "Location required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  country: z.string().min(1, "Country required"),
  date: z.string().min(1, "Date required"),
  commentaryEnabled: z.boolean(),
});

type FormValues = z.infer<typeof quickMatchSchema>;

const emptyPlayer = () => ({ name: "" });

export default function QuickMatchCreatePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(quickMatchSchema),
    defaultValues: {
      teamAName: "",
      teamBName: "",
      teamAPlayers: [emptyPlayer(), emptyPlayer()],
      teamBPlayers: [emptyPlayer(), emptyPlayer()],
      overs: 20,
      overLimit: 4,
      playerLimit: 11,
      category: "T20",
      location: "",
      city: "",
      state: "",
      country: "India",
      date: new Date().toISOString().split("T")[0],
      commentaryEnabled: false,
    },
  });

  const {
    fields: teamAFields,
    append: appendA,
    remove: removeA,
  } = useFieldArray({ control, name: "teamAPlayers" });

  const {
    fields: teamBFields,
    append: appendB,
    remove: removeB,
  } = useFieldArray({ control, name: "teamBPlayers" });

  const teamAName = watch("teamAName") || "Team A";
  const teamBName = watch("teamBName") || "Team B";
  const commentaryEnabled = watch("commentaryEnabled");
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsCreating(true);

    try {
      const now = new Date().toISOString();
      const matchId = `qm_${nanoid(10)}`;

      if (data.teamAPlayers.length !== data.teamBPlayers.length)
        throw new Error("Players must be equal on both side!");
      if (data.teamAPlayers.length !== data.playerLimit)
        throw new Error("Player limit does not match with the team!");
      if (data.teamAPlayers.length * data.overLimit < data.overs)
        throw new Error("Please increase over limit!");
      const teamA = buildTeam(data.teamAName, data.teamAPlayers);
      const teamB = buildTeam(data.teamBName, data.teamBPlayers);

      const match: QuickMatch = {
        id: matchId,
        version: 2,
        teamA,
        teamB,
        overs: data.overs,
        overLimit: data.overLimit,
        playerLimit: data.playerLimit,
        category: data.category,
        location: data.location,
        venue: { city: data.city, state: data.state, country: data.country },
        date: data.date,
        commentaryEnabled: data.commentaryEnabled,
        status: "not_started",
        innings: [],
        createdAt: now,
        updatedAt: now,
      };

      saveQuickMatch(match);
      toast.success("Quick Match created! Setting up the toss...");
      router.push(`/quick-match/${matchId}`);
    } catch (err) {
      if (err instanceof Error)
        toast.error(err?.message || "Failed to create match — please try again");
      else {
        toast.error("Failed to create match — please try again");
      }
      setIsCreating(false);
    }
  };

  const buildTeam = (name: string, players: { name: string }[]): QuickTeam => ({
    id: nanoid(),
    name,
    abbreviation: name
      .split(" ")
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 4),
    players: players.map((p) => ({
      ...p,
      id: nanoid(),
      player: {
        userId: nanoid(),
        user: {
          name: p.name,
          username: p.name.split(" ")[0].toLowerCase() + nanoid(5),
        },
      },
    })),
  });

  return (
    <div className="layout-background">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 pb-24">
        {/* ── Header ────────────────────────────────────────────────── */}
        <div>
          <span className="label-xs text-emerald-500">Guest Mode</span>
          <h1 className="heading-xl mt-1">
            Quick <span className="primary-heading">Match</span>
          </h1>
          <p className="secondary-text mt-2 text-sm">
            No sign-up needed. Your match is stored locally in this browser.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ── Teams ───────────────────────────────────────────────── */}
          <div className="hover-card relative grid grid-cols-1 items-start gap-6 rounded-[2rem] p-8 md:grid-cols-3">
            {/* Team A */}
            <TeamColumn
              teamLabel="Team A"
              nameKey="teamAName"
              playersKey="teamAPlayers"
              register={register}
              errors={errors}
              fields={teamAFields}
              onAdd={() => appendA(emptyPlayer())}
              onRemove={removeA}
              teamName={teamAName}
            />

            {/* VS divider */}
            <div className="flex items-center justify-center py-6 md:py-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-xl font-black text-white italic shadow-lg shadow-emerald-600/40">
                VS
              </div>
            </div>

            {/* Team B */}
            <TeamColumn
              teamLabel="Team B"
              nameKey="teamBName"
              playersKey="teamBPlayers"
              register={register}
              errors={errors}
              fields={teamBFields}
              onAdd={() => appendB(emptyPlayer())}
              onRemove={removeB}
              teamName={teamBName}
            />
          </div>

          {/* ── Match settings & venue ───────────────────────────────── */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left: Match Logic */}
            <div className="hover-card rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                  <Settings2 className="h-5 w-5" />
                </div>
                <h3 className="heading-md--poppins">Match Logic</h3>
              </div>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="label-field">Match Category</label>
                  <select {...register("category")} className="field-input appearance-none">
                    <option value="T10">T10</option>
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="others">Custom / Others</option>
                  </select>
                </div>
                {/* Overs / Over limit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Total Overs</label>
                    <div className="relative">
                      <Target className="field-icon" />
                      <input
                        {...register("overs", { valueAsNumber: true })}
                        type="number"
                        placeholder="20"
                        className="field-input--icon w-full"
                      />
                    </div>
                    {errors.overs && <p className="field-error">{errors.overs.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Over Limit</label>
                    <div className="relative">
                      <ShieldAlert className="field-icon" />
                      <input
                        {...register("overLimit", { valueAsNumber: true })}
                        type="number"
                        placeholder="4"
                        className="field-input--icon w-full"
                      />
                    </div>
                    {errors.overLimit && <p className="field-error">{errors.overLimit.message}</p>}
                  </div>
                </div>
                {/* Player limit */}
                <div>
                  <label className="label-field">Players per Side</label>
                  <div className="relative">
                    <Trophy className="field-icon" />
                    <input
                      {...register("playerLimit", { valueAsNumber: true })}
                      type="number"
                      placeholder="11"
                      className="field-input--icon w-full"
                    />
                  </div>
                  {errors.playerLimit && (
                    <p className="field-error">{errors.playerLimit.message}</p>
                  )}
                </div>
                {/* Commentary toggle */}
                <label className="flex cursor-pointer items-center gap-3">
                  <span className="label-sm text-slate-700 dark:text-slate-300">
                    Enable Commentary
                  </span>
                  <div
                    className={`switch bg-gradient-to-r ${commentaryEnabled ? "from-green-500 via-green-600 to-green-700" : "from-green-500/30 via-green-600/30 to-green-700/30"}`}
                  >
                    <input
                      {...register("commentaryEnabled")}
                      id="isRecruiting"
                      type="checkbox"
                      defaultChecked={commentaryEnabled}
                      className="relative z-20 h-full w-full rounded border-gray-300 text-emerald-600"
                    />
                    <div className="slider" />
                  </div>
                </label>
              </div>
            </div>

            {/* Right: Venue & Schedule */}
            <div className="hover-card rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="heading-md--poppins">Venue & Schedule</h3>
              </div>

              <div className="space-y-4">
                {/* Date */}
                <div>
                  <label className="label-field">Match Date</label>
                  <div className="relative">
                    <Calendar className="field-icon" />
                    <input {...register("date")} type="date" className="field-input--icon w-full" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="label-field col-span-2">Ground / Stadium</label>
                  <div className="relative">
                    <input
                      {...register("location")}
                      type="text"
                      placeholder="Wankhede Stadium"
                      className="field-input"
                    />
                  </div>
                  {errors.location && <p className="field-error">{errors.location.message}</p>}
                </div>

                {/* City / State / Country */}
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { key: "city", label: "City", placeholder: "Mumbai" },
                      { key: "state", label: "State", placeholder: "Maharashtra" },
                      { key: "country", label: "Country", placeholder: "India" },
                    ] as const
                  ).map(({ key, label, placeholder }) => (
                    <div key={key} className={key === "country" ? "col-span-2" : ""}>
                      <label className="label-field">{label}</label>
                      <input
                        {...register(key)}
                        type="text"
                        placeholder={placeholder}
                        className="field-input"
                      />
                      {errors[key] && <p className="field-error">{errors[key]?.message}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-4">
            <button type="button" onClick={() => router.back()} className="ghost-btn">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {isCreating ? "Creating..." : "Create Quick Match"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TeamColumnProps {
  teamLabel: string;
  nameKey: keyof FormValues;
  playersKey: "teamAPlayers" | "teamBPlayers";
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  fields: FieldArrayWithId<FormValues, "teamAPlayers" | "teamBPlayers", "id">[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  teamName: string;
}

function TeamColumn({
  teamLabel,
  nameKey,
  playersKey,
  register,
  errors,
  fields,
  onAdd,
  onRemove,
  teamName,
}: TeamColumnProps) {
  return (
    <div className="space-y-4">
      {/* Team avatar placeholder */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-slate-100 shadow-xl dark:border-slate-950 dark:bg-slate-800">
          <Shield className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        </div>
        <input
          {...register(nameKey)}
          type="text"
          placeholder={teamLabel}
          className="field-input text-center text-sm"
        />
        {errors?.[nameKey] && <p className="field-error">{errors[nameKey]?.message}</p>}
      </div>

      {/* Players */}
      <div className="space-y-2">
        <label className="label-field">{teamName} Players</label>
        {fields.map((field, index: number) => (
          <div key={field.id} className="flex items-center gap-2">
            <Fingerprint className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              {...register(`${playersKey}.${index}.name`)}
              type="text"
              placeholder={`Player ${index + 1}`}
              className="field-input py-2 text-xs"
            />

            {/* Remove */}
            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="icon-btn-reject p-1"
                title="Remove player"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-all hover:border-emerald-400 hover:text-emerald-500 dark:border-white/10"
        >
          <Plus className="h-3 w-3" />
          Add Player
        </button>
      </div>
    </div>
  );
}
