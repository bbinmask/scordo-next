"use client";

import React from "react";
import TeamDetails from "../_components/TeamDetails";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { currentUser } from "@/lib/currentUser";
import { User } from "@/generated/prisma";
interface TeamIdProps {
  params?: any;
}

const TeamIdPage: React.FC<TeamIdProps> = () => {
  const params: { abbr: string } = useParams();

  const {
    data: team,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/teams/${params.abbr}`);
      return data;
    },
  });

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/api/me");

      return res.data;
    },
  });

  return (
    <div className="center flex w-full">
      <div className="container-bg w-full rounded-2xl border">
        {isLoading ? (
          <Spinner />
        ) : !team && !isLoading && error?.message ? (
          <NotFoundParagraph description={error.message} />
        ) : (
          <TeamDetails team={team} user={user} />
        )}
      </div>
    </div>
  );
};

export default TeamIdPage;
