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
import { ITeamForm } from "../types";
import { debounce } from "lodash";
import axios from "axios";
import { Team } from "@/generated/prisma";

interface TeamFormProps {
  children: React.ReactNode;
  onSubmit: SubmitHandler<ITeamForm>;
  team?: Team;
}

const TeamForm = ({ children, onSubmit, team }: TeamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<ITeamForm>({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-[urbanist]">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Team Name */}
        <div>
          <div className="center mb-1 flex gap-1 lg:block">
            <label htmlFor="team-name" className="text-foreground mb-1 block text-base font-medium">
              <abbr className="" title="Enter your team's name">
                Name:
              </abbr>
            </label>
            <Input
              id="team-name"
              {...register("name", {
                required: team?.name ? false : "Team name is required",
                minLength: 3,
              })}
              placeholder={team?.name || "Enter your team's name"}
              className="text-foreground w-full py-1 text-sm font-normal"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <div className="center mb-1 flex gap-1 lg:block">
            <label
              htmlFor="abbreviation"
              className="text-foreground mb-1 block text-base font-medium"
            >
              <abbr className="" title="A short name for your team (eg. IND for INDIA)">
                Abbreviation:
              </abbr>
            </label>
            <Input
              id="abbreviation"
              {...register("abbreviation", {
                required: team?.abbreviation ? false : "Create an abbreviation for the team",
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
              className="text-foreground w-full py-1 text-sm font-normal"
            />
          </div>
          {errors.abbreviation && (
            <p className="mt-1 text-sm text-red-600">{errors.abbreviation.message}</p>
          )}
        </div>
        {/* Logo And Banner Upload */}
        {/*
         {!isUpdating && (
          <div>
            <label htmlFor="team-logo" className="text-foreground mb-1 block text-base font-medium">
              Team Logo
            </label>
            <Input
              id="team-logo"
              type="file"
              accept="image/*"
              {...register("logo", {
                onChange: (e) => handleFileChange(e, "logo"),
              })}
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-100 file:px-4 file:text-emerald-700 hover:file:bg-emerald-200"
            />
            {logoFileName && (
              <div>
                <img src={URL.createObjectURL(logo[0])} alt="LOGO" className="w-20 object-cover" />
              </div>
            )}
            {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>}
          </div>
        )}

        {!isUpdating && (
          <div>
            <label
              htmlFor="team-banner"
              className="text-foreground mb-1 block text-base font-medium"
            >
              Team Banner
            </label>
            <Input
              id="team-banner"
              type="file"
              accept="image/*"
              {...register("banner", {
                onChange: (e) => handleFileChange(e, "banner"),
              })}
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-100 file:px-4 file:text-emerald-700 hover:file:bg-emerald-200"
            />
            {bannerFileName && (
              <img src={URL.createObjectURL(banner[0])} alt="" className="w-20 object-cover" />
            )}
            {errors.banner && <p className="mt-1 text-sm text-red-600">{errors.banner.message}</p>}
          </div>
        )}
        */}
      </div>

      <div className="grid items-end gap-4 md:grid-cols-2">
        {/* Team Type */}

        <div>
          <div className="center mb-1 flex gap-1 lg:block">
            <label htmlFor="type" className="text-foreground mb-1 block text-base font-medium">
              <abbr title="Team Type">Type: </abbr>
            </label>
            <EnumFormSelect
              data={[
                { label: "Local", value: "local" },
                { label: "College", value: "college" },
                { label: "Club", value: "club" },
                { label: "Corporate", value: "corporate" },
                { label: "Others", value: "other" },
              ]}
              name="type"
              register={register}
              label="Team Type"
              placeholder={team?.type || "Select your team's type"}
              rules={{ required: team?.type ? false : "Type is required" }}
            />
          </div>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
        </div>
        {/* Location */}
        <div>
          <div className="center mb-1 flex gap-1 lg:block">
            <label htmlFor="city" className="text-foreground mb-1 block text-base font-medium">
              City:
            </label>
            <Input
              id="city"
              placeholder={team?.address?.city || "Enter your city"}
              {...register("address.city", {
                required: team?.address?.city ? false : "City is required",
              })}
              className="text-foreground w-full py-1 text-sm font-normal"
            />
          </div>
          {errors?.address?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
          )}
        </div>
        <div className="">
          <div className="center mb-1 flex gap-1 lg:block">
            <label htmlFor="state" className="text-foreground mb-1 block text-base font-medium">
              State:
            </label>
            <Input
              id="state"
              {...register("address.state", {
                required: team?.address?.state ? false : "State is required!",
              })}
              placeholder={team?.address?.state || "Enter your state"}
              className="text-foreground w-full py-1 text-sm font-normal"
            />
          </div>
          {errors.address?.state && (
            <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
          )}
        </div>
        <div>
          <div className="center mb-1 flex gap-1 lg:block">
            <label htmlFor="country" className="text-foreground mb-1 block text-base font-medium">
              Country:
            </label>
            <Input
              id="country"
              {...register("address.country", {
                required: team?.address?.country ? false : "Country is required",
              })}
              placeholder={team?.address?.country || "Enter your country"}
              className="text-foreground w-full py-1 text-sm font-normal"
            />
          </div>
          {errors?.address?.country && (
            <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
          )}
        </div>
      </div>

      {/* Recruiting */}
      {/* <div className="between relative flex gap-2">
        <label htmlFor="isRecruiting" className="text-accent-foreground text-base font-normal">
          Recruiting new players
        </label>
        <div
          className={`switch bg-gradient-to-r ${isRecruiting ? "from-lime-500 via-green-600 to-emerald-600" : "from-teal-900 via-green-900/80 to-gray-400/70"}`}
        >
          <Input
            id="isRecruiting"
            type="checkbox"
            {...register("isRecruiting")}
            className="relative z-20 h-full w-full rounded border-gray-300 text-emerald-600"
          />
          <div className="slider" />
        </div>
      </div> */}
      {children}
    </form>
  );
};

export default TeamForm;
