"use client";
import { MoonLoader } from "react-spinners";
import Card from "./Card";
import NewsList from "./NewsList";
import { user } from "@/constants";

const Dashboard = () => {
  const data = [
    {
      title: "Teams",
      desc: "Create or edit teams",
      link: "/teams/my-teams",
    },
    {
      title: "Performance",
      desc: "See your performance",
      link: "/stats/my-stats",
    },
  ];
  const loading = false;

  if (loading)
    return (
      <div>
        <MoonLoader className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <section className="mt-5 px-4">
      <div className="grid w-full items-center">
        <div className="mt-4"></div>

        <h2 className="my-6 text-center text-3xl font-extrabold text-gray-800 md:text-left">
          <span className="from-prime bg-gradient-to-r to-red-500 bg-clip-text text-transparent">
            Your Dashboard
          </span>
        </h2>
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => (
            <Card key={i} title={item.title} desc={item.desc} link={item.link} className={""} />
          ))}
        </div>

        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800 md:text-left">
          <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Latest Updates
          </span>
        </h2>

        <NewsList />
      </div>
    </section>
  );
};

export default Dashboard;
