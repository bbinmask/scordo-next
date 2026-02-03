"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createTeam } from "@/actions/team-actions";
import { useAction } from "@/hooks/useAction";
import { EnumFormSelect } from "../../_components/FormSelect";
import { debounce } from "lodash";
import axios from "axios";
import { Team } from "@/generated/prisma";
import { InputTypeForCreateTeam } from "@/actions/team-actions/types";
import {
  Building,
  ChevronRight,
  Globe,
  Hash,
  ImageIcon,
  MapPin,
  Plus,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import Spinner from "@/components/Spinner";
import { ImagePreview, UploadImg } from "@/components/Image";

interface TeamFormProps {
  children: React.ReactNode;
  onSubmit: SubmitHandler<InputTypeForCreateTeam>;
  team?: Team;
}

type Type = "logo" | "banner" | "avatar";

const TeamForm = ({ children, onSubmit, team }: TeamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    setValue,
    clearErrors,
    watch,
  } = useForm<InputTypeForCreateTeam>({
    defaultValues: {
      name: team?.name || "",
      type: team?.type || "others",
      abbreviation: team?.abbreviation || "",
      address: {
        city: team?.address?.city || "",
        state: team?.address?.state || "",
        country: team?.address?.country || "",
      },
    },
  });

  const [logoPreview, setLogoPreview] = useState<string>(team?.logo || "");
  const [bannerPreview, setBannerPreview] = useState<string>(team?.banner || "");

  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [bannerFileName, setBannerFileName] = useState<string | null>(null);
  const navigate = useRouter();

  // const handleFileChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   fieldName: "logo" | "banner"
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (fieldName === "logo") setLogoFileName(file?.name || null);
  //   if (fieldName === "banner") setBannerFileName(file?.name || null);
  // };

  const checkAbbreviation = useMemo(
    () =>
      debounce(async (value: string) => {
        try {
          const res = await axios.get(`/api/teams/${value}`);

          if (res.data.success) {
            setError("abbreviation", {
              message: `${value} is not available!`,
            });
          } else {
            clearErrors("abbreviation");
          }
        } catch (error) {
          toast.error("Something went wrong!");
        }
      }, 500),

    []
  );

  const handleSave = async (file: File, type: Type) => {
    const url = URL.createObjectURL(file);
    if (type === "logo") {
      setLogoPreview(url);
      setValue("logo", file);
    } else {
      setBannerPreview(url);
      setValue("banner", file);
    }
  };

  return (
    <div className="bg-slate-50 pb-24 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
      <div className="relative mb-12 h-64 w-full overflow-hidden md:h-80">
        {bannerPreview ? (
          <img src={bannerPreview} className="h-full w-full object-cover" alt="Banner Preview" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center opacity-30">
              <ImageIcon className="mb-2 h-12 w-12 text-white" />
              <p className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                Banner Preview
              </p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-black/20 dark:from-[#020617]" />
      </div>
      <div className="relative z-10 mx-auto -mt-36 flex max-w-5xl items-end px-6 pb-8">
        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-end">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2.5rem] border-8 border-slate-50 bg-white shadow-2xl md:h-40 md:w-40 dark:border-[#020617] dark:bg-slate-900">
            {logoPreview ? (
              <img
                src={logoPreview}
                className="z-50 h-full w-full object-cover"
                alt="Logo Preview"
              />
            ) : (
              <Shield className="h-12 w-12 text-slate-200 dark:text-slate-700" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic md:text-5xl">
                {getValues("name") || "SQUAD NAME"}
              </h2>
              {getValues("type") && (
                <span className="rounded-xl border border-slate-200 bg-white/40 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-500 uppercase backdrop-blur-md dark:border-white/10 dark:bg-white/10">
                  {getValues("type")}
                </span>
              )}
            </div>
            <p className="mt-1 text-lg font-bold text-slate-500 uppercase md:text-xl dark:text-slate-400">
              @{getValues("abbreviation") || "ABBR"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Core Identity */}
          <div className="space-y-8 lg:col-span-8">
            <section className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10 dark:border-white/10 dark:bg-slate-900">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black tracking-tighter uppercase italic">
                  Identity Setup
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Team Name */}
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Official Name
                  </label>
                  <div className="group relative">
                    <Users className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="text"
                      id="team-name"
                      {...register("name", {
                        required: team?.name ? false : "Team name is required",
                        minLength: 3,
                      })}
                      placeholder={team?.name || "Enter your team's name"}
                      defaultValue={getValues("name")}
                      minLength={3}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/5 dark:bg-slate-950"
                    />
                  </div>
                </div>

                {/* Abbreviation */}
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Team Handle / Abbr
                  </label>
                  <div className="group relative">
                    <Hash className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                    <input
                      type="text"
                      id="abbreviation"
                      {...register("abbreviation", {
                        required: team?.abbreviation
                          ? false
                          : "Create an abbreviation for the team",
                        pattern: {
                          value: /^[a-zA-Z0-9_-]+$/,
                          message: "Only letters, numbers, - and _ allowed",
                        },

                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;

                          if (!/^[a-z0-9_-]*$/.test(value)) {
                            setError("abbreviation", {
                              message: "This type of abbreviation is not available!",
                            });
                            return;
                          }
                          clearErrors("abbreviation");
                          checkAbbreviation(value);
                        },

                        validate: (value) => {
                          if (value.trim() === "" && !team?.abbreviation)
                            return "Abbreviation cannot be empty!";
                        },
                      })}
                      onKeyDown={(e) => {
                        const allowedRegex = /^[a-zA-Z0-9_-]$/;
                        const allowedKeys =
                          e.key === "Backspace" ||
                          e.key === "Delete" ||
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowRight" ||
                          e.key === "Tab";

                        if (allowedKeys) {
                        } else if (!allowedRegex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder={team?.abbreviation || "Create an abbreviation"}
                      required
                      defaultValue={getValues("abbreviation")}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm font-bold uppercase transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/5 dark:bg-slate-950"
                    />
                  </div>
                </div>

                {/* Team Type Select */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Squad Classification
                  </label>
                  <div className="group relative">
                    <Building className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      required
                      {...register("type", { required: "Type is required" })}
                      defaultValue={getValues("type")}
                      className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/5 dark:bg-slate-950"
                    >
                      <option value="" disabled>
                        Select Team Type
                      </option>
                      <option value="local">Local Team</option>
                      <option value="college">College / University</option>
                      <option value="club">Private Club</option>
                      <option value="corporate">Corporate Organization</option>
                      <option value="other">Other / Custom</option>
                    </select>
                    <ChevronRight className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* Location Section */}
            <section className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10 dark:border-white/10 dark:bg-slate-900">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black tracking-tighter uppercase italic">
                  Base Location
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={getValues("address.city")}
                    placeholder={team?.address?.city || "Enter your city"}
                    {...register("address.city", {
                      required: getValues("address.city") ? false : "City is required",
                    })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/5 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={getValues("address.state") || "Enter State Name"}
                    {...register("address.state", {
                      required: getValues("address.state") ? false : "State is required",
                    })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/5 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Country
                  </label>
                  <div className="group relative">
                    <Globe className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={getValues("address.country") || "Enter Country Name"}
                      {...register("address.country", {
                        required: getValues("address.country") ? false : "Country is required",
                      })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/5 dark:bg-slate-950"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Asset Uploads */}
          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <h4 className="mb-6 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase">
                <Upload className="h-3 w-3" /> Creative Assets
              </h4>

              {/* Logo Upload Card */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Squad Logo
                  </p>
                  <div className="group center relative flex w-full">
                    <ImagePreview url={logoPreview} type="logo">
                      <UploadImg url={logoPreview} onSave={handleSave} type="logo" />
                    </ImagePreview>
                  </div>
                </div>

                {/* Banner Upload Card */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Profile Banner
                  </p>
                  <div className="group center relative flex w-full">
                    <ImagePreview url={bannerPreview} type="banner">
                      <UploadImg url={bannerPreview} onSave={handleSave} type="banner" />
                    </ImagePreview>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="group relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 text-white shadow-2xl dark:bg-emerald-600">
              <Shield className="absolute top-2 right-2 h-32 w-32 -rotate-12 text-white/5 transition-transform duration-700 group-hover:rotate-0" />
              <h4 className="mb-2 text-xl font-black tracking-tighter uppercase italic">
                Deploy Scordo
              </h4>
              <p className="mb-6 text-xs leading-relaxed font-medium text-emerald-100/70">
                By initializing this squad, you agree to the regional competitive integrity
                guidelines.
              </p>
              {children}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
