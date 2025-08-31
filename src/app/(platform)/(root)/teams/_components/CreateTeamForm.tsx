"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createTeam } from "@/actions/team-actions";
import { useAction } from "@/hooks/useAction";
import { createUser } from "@/actions/user-actions";

interface ITeamForm {
  name: string;
  logo: FileList;
  banner: FileList;
  type: "local" | "college" | "club" | "corporate" | "others";
  abbreviation: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  isRecruiting: boolean;
}

const CreateTeamForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ITeamForm>({
    defaultValues: {
      name: "",
      type: "others",
      abbreviation: "",
      address: {
        city: "",
        state: "",
        country: "",
      },
      isRecruiting: false,
    },
  });

  const { execute, error, isLoading } = useAction(createTeam, {
    onSuccess: (data) => {
      toast.success(data.name + " is created");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: newExecute } = useAction(createUser);

  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [bannerFileName, setBannerFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (fieldName === "logo") setLogoFileName(file?.name || null);
    if (fieldName === "banner") setBannerFileName(file?.name || null);
  };
  const { fetchData } = useAxios();
  const isRecruiting = watch("isRecruiting");
  const logo = watch("logo");
  const banner = watch("banner");

  const onSubmit: SubmitHandler<ITeamForm> = async (data) => {
    const { name, abbreviation, type, address, logo, banner, isRecruiting } = data;
    const logoFile = logo && logo.length > 0 ? logo[0] : undefined;
    const bannerFile = banner && banner.length > 0 ? banner[0] : undefined;

    execute({
      name,
      abbreviation,
      type,
      address,
      logo: logoFile,
      banner: bannerFile,
      isRecruiting,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Team Name */}
        <div className="mb-1">
          <Input
            {...register("name", { required: "Team name is required" })}
            placeholder="Enter your team's name"
            className="text-foreground w-[calc(100%-2rem)] py-4 font-semibold"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Username */}
        <div className="mb-1">
          <label className="text-foreground mb-1 block text-base font-semibold">Username</label>
          <Input
            {...register("abbreviation", {
              required: "Create a abbreviation for the team",
            })}
            placeholder="Create a abbreviation"
            className="text-foreground w-[calc(100%-2rem)] py-4 font-semibold"
          />
          {errors.abbreviation && (
            <p className="mt-1 text-sm text-red-600">{errors.abbreviation.message}</p>
          )}
        </div>
        {/* Logo Upload */}
        <div>
          <label className="text-foreground mb-1 block text-base font-semibold">Team Logo</label>
          <Input
            type="file"
            accept="image/*"
            {...register("logo", {
              onChange: (e) => handleFileChange(e, "logo"),
            })}
            className="block w-[calc(100%-2rem)] text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-100 file:px-4 file:text-emerald-700 hover:file:bg-emerald-200"
          />
          {logoFileName && (
            <div>
              <img src={URL.createObjectURL(logo[0])} alt="LOGO" className="w-20 object-cover" />
            </div>
          )}
          {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>}
        </div>

        {/* Banner Upload */}
        <div>
          <label className="text-foreground mb-1 block text-base font-semibold">Team Banner</label>
          <Input
            type="file"
            accept="image/*"
            {...register("banner", {
              onChange: (e) => handleFileChange(e, "banner"),
            })}
            className="block w-[calc(100%-2rem)] text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-100 file:px-4 file:text-emerald-700 hover:file:bg-emerald-200"
          />
          {bannerFileName && (
            <img src={URL.createObjectURL(banner[0])} alt="" className="w-20 object-cover" />
          )}
          {errors.banner && <p className="mt-1 text-sm text-red-600">{errors.banner.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Team Type */}
        <div>
          <label className="text-foreground mb-1 block text-base font-semibold">Team Type</label>
          <select
            id="type"
            {...register("type", { required: "Select a team type" })}
            defaultValue={"local"}
            className="w-[calc(100%-2rem)] rounded-md border border-gray-300 bg-white p-2 font-semibold text-gray-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100"
          >
            <option value="local">Local</option>
            <option value="college">College</option>
            <option value="club">Club</option>
            <option value="corporate">Corporate</option>
            <option value="others">Others</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="text-foreground mb-1 block text-base font-semibold">City</label>
          <Input
            placeholder="Enter your city"
            {...register("address.city", { required: "City is required" })}
            className="text-foreground w-[calc(100%-2rem)] py-4 font-semibold"
          />
          {errors.address?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
          )}
        </div>
        <div>
          <label className="text-foreground mb-1 block text-base font-semibold">State</label>
          <Input
            {...register("address.state")}
            placeholder="Enter your state"
            className="text-foreground w-[calc(100%-2rem)] py-4 font-semibold"
          />
          {errors.address?.state && (
            <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
          )}
        </div>
        <div className="">
          <label className="text-foreground mb-1 block text-base font-semibold">Country</label>
          <Input
            {...register("address.country", {
              required: "Country is required",
            })}
            placeholder="Enter your country"
            className="text-foreground w-[calc(100%-2rem)] py-4 font-semibold"
          />
          {errors.address?.country && (
            <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
          )}
        </div>
      </div>

      {/* Recruiting */}
      <div className="between relative flex gap-2">
        {" "}
        <label className="text-accent-foreground text-base font-semibold">
          Recruiting new players
        </label>
        <div
          className={`switch bg-gradient-to-r ${isRecruiting ? "from-lime-500 via-green-600 to-emerald-600" : "from-teal-900 via-green-900/80 to-gray-400/70"}`}
        >
          <Input
            type="checkbox"
            {...register("isRecruiting")}
            className="relative z-20 h-full w-full rounded border-gray-300 text-emerald-600"
          />
          <div className="slider" />
        </div>
      </div>

      {/* Submit */}
      <Button
        variant="default"
        type="submit"
        disabled={loading}
        className={`font-urbanist relative w-full rounded-md border-none bg-emerald-600 px-6 py-3 tracking-wide text-white outline-none hover:bg-emerald-700 focus:ring-1 focus:ring-emerald-500 ${loading && "text-opacity-70"}`}
      >
        Create Team
        {loading && <CgSpinner className="absolute animate-spin text-white" />}
      </Button>
    </form>
  );
};

export default CreateTeamForm;
