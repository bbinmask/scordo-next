import { User } from "@/generated/prisma";
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

const QuickActionButton = ({ title, icon: Icon, href }: QuickActionButtonProps) => (
  <Link
    href={href}
    className="flex items-center rounded-lg bg-white/10 p-4 font-[urbanist] backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
  >
    <Icon className="h-6 w-6 text-green-300" />
    <span className="ml-4 font-semibold text-white">{title}</span>
  </Link>
);

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
    <div
      className="border-input relative mb-8 overflow-hidden rounded-xl border bg-cover bg-center p-6 text-white shadow-lg md:p-8"
      style={{
        backgroundImage: `url(${banner})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-[cal_sans] text-3xl font-extrabold tracking-wide md:text-4xl">
              Welcome back, {user?.username || "User"}!
            </h1>
            <p className="text-md font-[poppins] leading-10 text-gray-300">
              Here's your personal cricket hub.
            </p>
          </div>
        </header>

        <div className="grid items-center gap-6 md:grid-cols-5">
          {/* Upcoming Match Card */}
          <div className="rounded-lg bg-white/10 p-5 backdrop-blur-md md:col-span-3">
            <h2 className="mb-3 font-[poppins] text-sm font-bold tracking-wider text-gray-300 uppercase">
              Your Next Match
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={upcomingMatch.teamA.logo}
                  alt={upcomingMatch.teamA.name}
                  className="h-12 w-12 rounded-full"
                />
                <span className="font-[cal_sans] text-xl tracking-wide">
                  {upcomingMatch.teamA.name}
                </span>
              </div>
              <span className="text-lg font-bold text-gray-400">vs</span>
              <div className="flex items-center space-x-3">
                <span className="font-[cal_sans] text-xl tracking-wide">
                  {upcomingMatch.teamB.name}
                </span>
                <img
                  src={upcomingMatch.teamB.logo}
                  alt={upcomingMatch.teamB.name}
                  className="h-12 w-12 rounded-full"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-[poppins] font-semibold">{upcomingMatch.time}</p>
              <p className="font-[poppins] text-xs text-gray-300">{upcomingMatch.venue}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 md:col-span-2">
            <QuickActionButton title="Create a New Match" icon={PlusCircle} href="#" />
            <QuickActionButton title="Find a Player" icon={Search} href="#" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
