import { user } from "@/constants";
import { MoonLoader } from "react-spinners";
import Card, { NewCard } from "./_components/Card";
import NewsList, { NewList } from "./_components/NewsList";
import { CarouselSpacing } from "./_components/CarouselSpacing";
import { BarChart2, Calendar, Play, Users } from "lucide-react";
import { TypographyHeading } from "@/components/Typography";
import UpdatesAndNewsWrapper from "./_components/UpdatesAndNewsWrapper";

const DashboardPage = () => {
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
      link: "/stats/my-stats",
      icon: <BarChart2 className="h-6 w-6" />,
    },
  ];
  const loading = false;

  if (loading) {
    return <MoonLoader className="animate-spin text-black" />;
  }

  return (
    <div className="container mt-5 block w-full items-center">
      <section className="">
        <div className="mb-8">
          <TypographyHeading className="mb-4 px-4" content="Live on Scordo" />
          <CarouselSpacing matches={Array.from({ length: 10 }).fill(0)} status="Live" />{" "}
        </div>
        <div className="mb-8">
          <TypographyHeading className="mb-4 px-4" content="Upcoming on Scordo" />

          <CarouselSpacing matches={Array.from({ length: 10 }).fill(0)} status="Upcoming" />
        </div>
      </section>

      <div className="px-4">
        <div className="mb-6 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            <span className="bg-gradient-to-r from-green-800 to-lime-600 bg-clip-text text-transparent dark:from-green-600 dark:to-lime-500">
              Dashboard
            </span>
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage your teams and track your performance.
          </p>
        </div>

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

        <div className="mb-6 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
              Featured
            </span>
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Stay informed with the latest news and announcements.
          </p>
        </div>
        <UpdatesAndNewsWrapper />
      </div>

      {/* <NewsList /> */}
    </div>
  );
};

export default DashboardPage;
