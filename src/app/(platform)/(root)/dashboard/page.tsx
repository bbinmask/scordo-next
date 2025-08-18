import { user } from "@/constants";
import { MoonLoader } from "react-spinners";
import Card from "./_components/Card";
import NewsList from "./_components/NewsList";
import { CarouselSpacing } from "./_components/CarouselSpacing";
import { Calendar, Play } from "lucide-react";

const DashboardPage = () => {
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

  if (loading) {
    return <MoonLoader className="animate-spin text-black" />;
  }

  return (
    <div className="mt-5 px-4">
      <div className="container mx-auto block items-center">
        <section className="">
          <div className="mb-8">
            <h2 className="flex items-center font-[cal_sans] text-3xl font-extrabold tracking-wide text-lime-600 drop-shadow-lg sm:text-4xl dark:text-lime-300">
              LIVE ON SCORDO
            </h2>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
              Follow the action as it happens!
            </p>
          </div>

          <CarouselSpacing matches={["1", "2", "3", "4"]} status="Live" />

          <h3 className="my-6 flex items-center text-3xl font-bold text-gray-800 dark:text-gray-100">
            <Calendar className="mr-3 h-8 w-8 text-green-600" /> Upcoming Matches
          </h3>

          <CarouselSpacing matches={["1", "2", "3", "4"]} status="Upcoming" />
        </section>

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
    </div>
  );
};

export default DashboardPage;
