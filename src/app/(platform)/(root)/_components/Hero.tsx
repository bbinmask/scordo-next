import { UserWithTeamsProps } from "@/lib/types";
import AxiosRequest from "@/utils/AxiosResponse";
import { useQuery } from "@tanstack/react-query";
import { LucideProps, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface QuickActionButtonProps {
  title: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  href: string;
}

const QuickActionButton = ({ title, icon: Icon, href }: QuickActionButtonProps) => {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl bg-slate-100 p-4 font-[urbanist] font-semibold shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-slate-200/60 hover:shadow-md dark:bg-slate-800/50 dark:text-slate-300 dark:ring-slate-700/50 dark:hover:bg-slate-800/80 dark:hover:text-white dark:hover:shadow-lg dark:hover:shadow-teal-500/10 dark:hover:ring-slate-600"
    >
      <span className="font-sans tracking-wide text-slate-700 dark:text-slate-300">{title}</span>
      <Icon className="h-5 w-5 text-slate-500 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400" />
    </Link>
  );
};

interface HeroSectionProps {
  user?: UserWithTeamsProps;
}

const HeroSection = ({ user }: HeroSectionProps) => {
  const upcomingMatch = {
    teamA: { name: "Bengaluru Blasters", logo: "https://placehold.co/60x60/A62626/FFFFFF?text=BB" },
    teamB: { name: "Rival XI", logo: "https://placehold.co/60x60/333/FFF?text=RXI" },
    time: "Tomorrow, 7:30 PM",
    venue: "City Cricket Ground",
  };

  const banner = user?.players[0].team.banner
    ? user?.players[0].team.banner
    : `/assets/banners/hero-team-banner.png`;

  console.log(banner);

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-lg shadow-slate-200/50 md:p-8 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:shadow-2xl dark:shadow-black/30">
      {/* Subtle background glow effect */}
      <div
        className="absolute top-0 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative z-10">
        <header className="mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl dark:text-slate-100">
              Welcome back, {user?.username || "User"}!
            </h1>
            <p className="text-md mt-2 text-slate-600 dark:text-slate-400">
              Here's your personal cricket hub.
            </p>
          </div>
        </header>

        <div className="grid items-stretch gap-6 md:grid-cols-5">
          {/* Upcoming Match Card */}
          <div className="flex flex-col rounded-xl bg-white/60 p-5 shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:ring-slate-300 md:col-span-3 dark:bg-slate-800/50 dark:shadow-lg dark:ring-slate-700/50 dark:hover:ring-slate-600">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-teal-600 uppercase dark:text-teal-400">
              Your Next Match
            </h2>
            <div className="grid grid-cols-5 items-center justify-between">
              <div className="col-span-2 flex flex-col items-center gap-2 text-center md:flex-row md:gap-4">
                <img
                  src={upcomingMatch.teamA.logo}
                  alt={upcomingMatch.teamA.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 md:h-14 md:w-14 dark:ring-slate-600"
                />
                <span className="font-[poppins] text-lg font-semibold text-slate-800 md:text-xl dark:text-slate-100">
                  {upcomingMatch.teamA.name}
                </span>
              </div>
              <span className="col-span-1 text-center text-lg font-bold text-slate-400 dark:text-slate-500">
                vs
              </span>
              <div className="col-span-2 flex flex-col-reverse items-center gap-2 text-center md:flex-row md:gap-4">
                <span className="font-[poppins] text-lg font-semibold text-slate-800 md:text-xl dark:text-slate-100">
                  {upcomingMatch.teamB.name}
                </span>
                <img
                  src={upcomingMatch.teamB.logo}
                  alt={upcomingMatch.teamB.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 md:h-14 md:w-14 dark:ring-slate-600"
                />
              </div>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-4 text-center dark:border-slate-700">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                {upcomingMatch.time}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{upcomingMatch.venue}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col justify-center space-y-4 md:col-span-2">
            <QuickActionButton
              title="Create a New Match"
              icon={PlusCircle}
              href="/matches/create"
            />
            <QuickActionButton title="Find a Player" icon={Search} href="/explore" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
