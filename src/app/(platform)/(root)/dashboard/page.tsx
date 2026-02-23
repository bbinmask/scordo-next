"use client";

import { NewCard } from "./_components/Card";
import { BarChart2, Newspaper, Users, Video } from "lucide-react";
import { TypographyHeading } from "@/components/Typography";
import Tabs from "../_components/Tabs";
import { useState } from "react";
import { UpdatesList } from "./_components/NewsList";
import { VideoList } from "../_components/VideoList";
import HeroSection from "../_components/Hero";
import { useQuery } from "@tanstack/react-query";
import { DefaultLoader } from "@/components/Spinner";
import { Carousel } from "@/components/carousel";
import { LiveMatchCard, UpcomingMatchCard } from "../_components/MatchList";
import axios from "axios";
import { MatchWithDetails } from "@/lib/types";

const cardData = [
  {
    title: "Teams",
    desc: "Create or edit teams",
    link: "/teams/my-teams",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Performance",
    desc: "See your performance",
    link: "/profile/stats",
    icon: <BarChart2 className="h-6 w-6" />,
  },
];

const contentTabs = [
  { id: "updates", label: "Latest Updates", icon: <Newspaper className="mr-2 h-5 w-5" /> },
  { id: "videos", label: "Featured Videos", icon: <Video className="mr-2 h-5 w-5" /> },
];

const DashboardPage = () => {
  const [currentTab, setCurrentTab] = useState("updates");

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
            <div className="mb-6 text-left">
              <h1 className="font-[poppins] text-4xl font-extrabold">
                <span className="bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent dark:from-green-500 dark:to-emerald-400">
                  Dashboard
                </span>
              </h1>
            </div>

            <HeroSection user={user} />
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {cardData.map((item, i) => (
                <NewCard
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
          <section className="px-4" title="Featured">
            <div className="mb-6 text-center md:text-left">
              <h2 className="font-[poppins] text-4xl font-extrabold text-gray-800 dark:text-white">
                <span className="bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent dark:from-green-500 dark:to-emerald-400">
                  Featured
                </span>
              </h2>
            </div>
            <div className="container-bg w-full rounded-xl p-4 sm:p-6">
              <Tabs setCurrentTab={setCurrentTab} currentTab={currentTab} tabs={contentTabs} />

              {currentTab === "updates" && <UpdatesList />}
              {currentTab === "videos" && <VideoList />}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
