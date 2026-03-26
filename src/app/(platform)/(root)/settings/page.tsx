"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/generated/prisma";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useAction";
import { updateUserDetails } from "@/actions/user-actions";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Zap,
  Shield,
  Save,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { DefaultLoader } from "@/components/Spinner";
import { BentoCard } from "../_components/cards/bento-card";
import { checkAvailability, getFullAddress } from "@/utils";
import { formatDate } from "@/utils/helper/formatDate";
import { capitalize } from "lodash";
import Link from "next/link";

interface SettingsFormData {
  username: string;
  name: string;
  contact: string | null;
  bio: string | null;
  gender: "male" | "female" | "other" | null;
  dob: Date;
}

const availabilityOptions = [
  {
    value: "available",
    label: "Available",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    value: "injured",
    label: "Injured",
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/30",
  },
  {
    value: "on_break",
    label: "On Break",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-[urbanist] text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-green-500";

const labelClass =
  "mb-2 block font-[poppins] text-xs font-semibold tracking-widest text-slate-400 uppercase";

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me");
      return data.data;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    values: user
      ? {
          username: user.username,
          name: user.name,
          contact: user.contact ?? null,
          bio: user.bio ?? null,
          gender: user.gender ?? null,
          dob: new Date(user.dob),
        }
      : undefined,
  });

  const { execute, isLoading: isSaving } = useAction(updateUserDetails, {
    onSuccess() {
      toast.success("Settings saved!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError(err) {
      toast.error(err);
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    execute({
      ...data,
      dob: new Date(data.dob),
    });
  };

  if (isLoading) return <DefaultLoader />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 pb-24 font-sans text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
      {/* Hero Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-green-800 md:h-52">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-[#020617]" />
        <div className="absolute inset-0 flex items-end px-6 pb-6 md:px-10">
          <div>
            <h1 className="font-[poppins] text-3xl font-black tracking-tight text-white md:text-4xl">
              Account Settings
            </h1>
            <p className="mt-1 font-[urbanist] text-sm font-semibold text-green-200">
              Manage your profile, preferences and security
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-4 max-w-5xl space-y-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-[urbanist] text-xs font-semibold text-slate-400">
          <Link href="/profile" className="transition-colors hover:text-green-500">
            Profile
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-300">Settings</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Info Card */}
          <BentoCard title="Profile Information" icon={UserIcon}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "At least 3 characters" },
                  })}
                  className={inputClass}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1 font-[urbanist] text-xs font-semibold text-rose-500">
                    <AlertCircle className="h-3 w-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Username</label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-[urbanist] text-sm font-bold text-slate-400">
                    @
                  </span>
                  <input
                    {...register("username", {
                      required: "Username is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                      maxLength: { value: 30, message: "Max 30 characters" },
                    })}
                    className={`${inputClass} pl-8`}
                    placeholder="username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1.5 flex items-center gap-1 font-[urbanist] text-xs font-semibold text-rose-500">
                    <AlertCircle className="h-3 w-3" /> {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  {...register("dob", { required: "Date of birth is required" })}
                  className={inputClass}
                />
                {errors.dob && (
                  <p className="mt-1.5 flex items-center gap-1 font-[urbanist] text-xs font-semibold text-rose-500">
                    <AlertCircle className="h-3 w-3" /> {errors.dob.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select {...register("gender")} className={inputClass}>
                  <option value="">Prefer not to say</option>
                  {genderOptions.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </BentoCard>

          {/* Contact Card */}
          <BentoCard title="Contact Details" icon={Mail}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={user.email}
                    readOnly
                    className={`${inputClass} cursor-not-allowed pl-10 opacity-60`}
                  />
                </div>
                <p className="mt-1.5 font-[urbanist] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  Managed by Clerk · cannot be changed here
                </p>
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    {...register("contact", {
                      minLength: { value: 10, message: "At least 10 digits" },
                      pattern: { value: /^\d+$/, message: "Numbers only" },
                    })}
                    className={`${inputClass} pl-10`}
                    placeholder="Your phone number"
                  />
                </div>
                {errors.contact && (
                  <p className="mt-1.5 flex items-center gap-1 font-[urbanist] text-xs font-semibold text-rose-500">
                    <AlertCircle className="h-3 w-3" /> {errors.contact.message}
                  </p>
                )}
              </div>
            </div>
          </BentoCard>

          {/* Bio Card */}
          <BentoCard title="About You" icon={FileText}>
            <label className={labelClass}>Bio</label>
            <textarea
              {...register("bio", {
                maxLength: { value: 200, message: "Max 200 characters" },
              })}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Write a short bio about yourself..."
            />
            <div className="mt-2 flex items-center justify-between">
              {errors.bio ? (
                <p className="flex items-center gap-1 font-[urbanist] text-xs font-semibold text-rose-500">
                  <AlertCircle className="h-3 w-3" /> {errors.bio.message}
                </p>
              ) : (
                <span />
              )}
              <span className="font-[urbanist] text-xs font-semibold text-slate-400">
                {watch("bio")?.length ?? 0} / 200
              </span>
            </div>
          </BentoCard>

          {/* Read-only info panel */}
          <BentoCard title="Account Info" icon={Shield}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-slate-800/50">
                <p className="mb-1 font-[poppins] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  Role
                </p>
                <p className="font-[urbanist] text-sm font-bold text-slate-700 dark:text-slate-200">
                  {capitalize(user.role)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-slate-800/50">
                <p className="mb-1 font-[poppins] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  Verified
                </p>
                <p
                  className={`font-[urbanist] text-sm font-bold ${user.isVerified ? "text-emerald-500" : "text-slate-400"}`}
                >
                  {user.isVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-slate-800/50">
                <p className="mb-1 font-[poppins] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  Availability
                </p>
                <p
                  className={`font-[urbanist] text-sm font-bold ${user.availability === "available" ? "text-emerald-500" : user.availability === "injured" ? "text-rose-500" : "text-amber-500"}`}
                >
                  {checkAvailability(user.availability)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-slate-800/50">
                <p className="mb-1 font-[poppins] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  Member Since
                </p>
                <p className="font-[urbanist] text-sm font-bold text-slate-700 dark:text-slate-200">
                  {formatDate(new Date(user.createdAt))?.split(",")[1]?.trim() ?? "—"}
                </p>
              </div>
            </div>
            <p className="mt-4 font-[urbanist] text-xs font-semibold text-slate-400">
              To update availability or address, use the{" "}
              <Link href="/profile" className="text-green-500 underline underline-offset-2">
                Edit Details
              </Link>{" "}
              option on your profile.
            </p>
          </BentoCard>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4 pb-4">
            {isDirty && (
              <p className="flex items-center gap-1.5 font-[urbanist] text-sm font-semibold text-amber-500">
                <AlertCircle className="h-4 w-4" /> Unsaved changes
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="primary-btn flex items-center gap-2 rounded-2xl px-8 py-3 font-[urbanist] text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
