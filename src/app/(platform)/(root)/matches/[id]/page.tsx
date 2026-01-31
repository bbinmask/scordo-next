"use client";

import { Match } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";

interface MatchIdPageProps {}

const MatchIdPage = ({}: MatchIdPageProps) => {
  const { id } = useParams();

  const { data: match } = useQuery<Match>({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${id}`);

      return data.data;
    },
  });

  console.log({ match });

  return <div>MatchIdPage</div>;
};

export default MatchIdPage;
