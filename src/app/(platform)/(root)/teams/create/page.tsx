"use client";
import z from "zod";
import React from "react";
import TeamForm from "../_components/TeamForm";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
import { createTeam } from "@/actions/team-actions";
import { SubmitHandler } from "react-hook-form";
import { ITeamForm } from "../types";
import { Button } from "@/components/ui/button";
import { CgSpinner } from "react-icons/cg";
import { InputTypeForCreateTeam } from "@/actions/team-actions/types";
import Spinner from "@/components/Spinner";

const CreateTeamPage = () => {
  const { execute, error, isLoading } = useAction(createTeam, {
    onSuccess: (data) => {
      toast.success(data.name + " is created");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error);
    },
  });

  const onSubmit: SubmitHandler<InputTypeForCreateTeam> = async (data) => {
    const { name, abbreviation, type, address, logo, banner } = data;

    execute({
      name,
      abbreviation,
      type,
      address,
      logo,
      banner,
    });
  };

  return (
    <div className="bg-slate-50 pb-24 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
      <TeamForm onSubmit={onSubmit}>
        <div className="center flex w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="center flex w-full rounded-2xl bg-white py-4 font-[poppins] text-[10px] font-black text-emerald-600 uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale dark:text-slate-900"
          >
            {isLoading ? <Spinner className="text-black" /> : "Create Squad"}
          </button>
        </div>
      </TeamForm>
    </div>
  );
};

export default CreateTeamPage;
