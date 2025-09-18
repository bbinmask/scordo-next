"use client";

import { notFound } from "next/navigation";
import React from "react";
import TeamDetails from "../_components/TeamDetails";
import { teams } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AxiosRequest from "@/utils/AxiosResponse";
import { useParams } from "next/navigation";
import Spinner from "@/components/Spinner";
interface TeamIdProps {
  params?: any;
}

const TeamIdPage: React.FC<TeamIdProps> = () => {
  const params: { teamId: string } = useParams();
  const abbr = params?.teamId?.split("-team-")[1];

  console.log(params);

  const {
    data: team,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await AxiosRequest.get("/api/teams/rcb");
      return data;
    },
  });

  return (
    <div className="center flex w-full">
      <div className="container-bg w-full rounded-2xl border">
        {isLoading ? <Spinner /> : !team && !isLoading ? notFound() : <TeamDetails team={team} />}
      </div>
    </div>
  );
};

export default TeamIdPage;
