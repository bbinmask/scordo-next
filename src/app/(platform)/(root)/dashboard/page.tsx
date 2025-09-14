import { MoonLoader } from "react-spinners";
import { NewCard } from "./_components/Card";
import { CarouselSpacing } from "./_components/CarouselSpacing";
import { BarChart2, Newspaper, Users, Video } from "lucide-react";
import { TypographyHeading } from "@/components/Typography";
import UpdatesAndNewsWrapper from "../_components/Tabs";

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
      link: "/profile/stats",
      icon: <BarChart2 className="h-6 w-6" />,
    },
  ];
  const loading = false;

  const contentTabs = [
    { id: "updates", label: "Latest Updates", icon: <Newspaper className="mr-2 h-5 w-5" /> },
    { id: "videos", label: "Featured Videos", icon: <Video className="mr-2 h-5 w-5" /> },
  ];

  if (loading) {
    return <MoonLoader className="animate-spin text-black" />;
  }

  return (
    <div className="block w-full items-center">
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
          <h1 className="font-[poppins] text-4xl font-extrabold text-gray-800 dark:text-white">
            <span className="bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent dark:from-green-500 dark:to-emerald-400">
              Dashboard
            </span>
          </h1>
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
          <h2 className="font-[poppins] text-4xl font-extrabold text-gray-800 dark:text-white">
            <span className="bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent dark:from-green-500 dark:to-emerald-400">
              Featured
            </span>
          </h2>
        </div>
        <UpdatesAndNewsWrapper tabs={contentTabs} />
      </div>
    </div>
  );
};

export default DashboardPage;
