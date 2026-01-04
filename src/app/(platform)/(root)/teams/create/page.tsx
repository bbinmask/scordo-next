"use client";

import React from "react";
import TeamForm from "../_components/TeamForm";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
import { createTeam } from "@/actions/team-actions";
import { SubmitHandler } from "react-hook-form";
import { ITeamForm } from "../types";
import { Button } from "@/components/ui/button";
import { CgSpinner } from "react-icons/cg";

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

  const onSubmit: SubmitHandler<ITeamForm> = async (data) => {
    const { name, abbreviation, type, address } = data;

    execute({
      name,
      abbreviation,
      type,
      address,
    });
  };

  return (
    <div className="center flex w-full">
      <div className="container-bg w-full rounded-2xl border p-6 lg:p-10">
        <h2 className="primary-heading mb-6 text-center font-[cal_sans] text-3xl font-black tracking-wide">
          Create Your Team
        </h2>
        <TeamForm onSubmit={onSubmit}>
          <div className="center flex w-full">
            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
              className={`primary-btn w-full max-w-48`}
            >
              {!isLoading && "Create Team"}
              {isLoading && <CgSpinner className="absolute animate-spin text-white" />}
            </Button>
          </div>
        </TeamForm>
      </div>
    </div>
  );
};

export default CreateTeamPage;
