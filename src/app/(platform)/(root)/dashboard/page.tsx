"use client";

import { Card } from "./_components/Card";
import { BarChart2, Newspaper, Shield, Video } from "lucide-react";
import { TypographyHeading } from "@/components/Typography";
import Tabs from "../_components/Tabs";
import { useState } from "react";
import HeroSection from "../_components/Hero";
import { useQuery } from "@tanstack/react-query";
import { DefaultLoader } from "@/components/Spinner";
import { Carousel } from "@/components/carousel";
import { LiveMatchCard } from "../_components/cards/LiveMatchCard";
import { UpcomingMatchCard } from "../_components/cards/UpcomingMatchCard";
import axios from "axios";
import { MatchWithDetails } from "@/lib/types";

const cardData = [
  {
    title: "Teams",
    desc: "Create or edit teams",
    link: "/teams",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Performance",
    desc: "See your performance",
    link: "/profile",
    icon: <BarChart2 className="h-6 w-6" />,
  },
];

const contentTabs = [
  { id: "updates", label: "Latest Updates", icon: <Newspaper className="mr-2 h-5 w-5" /> },
  { id: "videos", label: "Featured Videos", icon: <Video className="mr-2 h-5 w-5" /> },
];

const DashboardPage = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axios.get("/api/u/profile");
      return data.data;
    },
  });

  const { data: dashboardMatches } = useQuery<{
    liveMatches: MatchWithDetails[];

    upcomingMatches: MatchWithDetails[];
  }>({
    queryKey: ["dashboard-matches"],
    queryFn: async () => {
      const { data } = await axios.get("/api/matches/dashboard");
      if (!data.success) return null;

      return data.data;
    },
  });

  return (
    <div className="block w-full items-center pb-20">
      {isLoading ? (
        <DefaultLoader className="text-white" />
      ) : (
        <div className="py-4">
          <section className="px-4" title="Dashboard">
            <HeroSection user={user} />
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {cardData.map((item, i) => (
                <Card
                  icon={item.icon}
                  key={i}
                  title={item.title}
                  desc={item.desc}
                  link={item.link}
                />
              ))}
            </div>
          </section>
          <section title="matches" className="">
            <div className="mb-8">
              <TypographyHeading className="mb-4 px-4 font-black" content="Live on Scordo" />
              <Carousel>
                {dashboardMatches?.liveMatches.length ? (
                  dashboardMatches.liveMatches.map((match) => (
                    <LiveMatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No live matches at the moment.
                  </p>
                )}
              </Carousel>
            </div>
            <div className="mb-8">
              <TypographyHeading className="mb-4 px-4 font-black" content="Upcoming on Scordo" />

              <Carousel>
                {dashboardMatches?.upcomingMatches.length ? (
                  dashboardMatches.upcomingMatches.map((match) => (
                    <UpcomingMatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No upcoming matches at the moment.
                  </p>
                )}
              </Carousel>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
