"use client";

import { MoonLoader } from "react-spinners";
import { NewCard } from "./_components/Card";
import { CarouselSpacing } from "./_components/CarouselSpacing";
import { BarChart2, Newspaper, Users, Video } from "lucide-react";
import { TypographyHeading } from "@/components/Typography";
import Tabs from "../_components/Tabs";
import { useState } from "react";
import { UpdatesList } from "./_components/NewsList";
import { VideoList } from "../_components/VideoList";
import HeroSection from "../_components/Hero";
import AxiosRequest from "@/utils/AxiosResponse";
import { useQuery } from "@tanstack/react-query";

const data = [
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
      const { data } = await AxiosRequest.get("/api/user/profile");
      return data;
    },
  });

  console.log(user);

  if (isLoading) {
    return <MoonLoader className="animate-spin text-black" />;
  }

  return (
    <div className="block w-full items-center">
      <div className="px-4">
        <section className="" title="Dashboard">
          <div className="mb-6 text-center md:text-left">
            <h1 className="font-[poppins] text-4xl font-extrabold text-gray-800 dark:text-white">
              <span className="bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent dark:from-green-500 dark:to-emerald-400">
                Dashboard
              </span>
            </h1>
          </div>

          <HeroSection user={user} />
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.map((item, i) => (
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
            <TypographyHeading className="mb-4 px-4" content="Live on Scordo" />
            <CarouselSpacing matches={Array.from({ length: 10 }).fill(0)} status="Live" />{" "}
          </div>
          <div className="mb-8">
            <TypographyHeading className="mb-4 px-4" content="Upcoming on Scordo" />

            <CarouselSpacing matches={Array.from({ length: 10 }).fill(0)} status="Upcoming" />
          </div>
        </section>
        <section className="" title="Featured">
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
    </div>
  );
};

export default DashboardPage;
