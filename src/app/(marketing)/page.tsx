import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BarChart2, PlayCircle, Trophy, Users } from "lucide-react";
import Link from "next/link";

const MarketingPage = () => {
  return (
    <div className="font-inter h-full w-full">
      <Navbar />
      <div className="container mx-auto px-4 pt-16 pb-4 sm:px-6 md:px-8">
        {/* Hero Section */}
        <section className="between mt-4 mb-10 flex flex-col rounded-2xl bg-white bg-gradient-to-br p-6 shadow-xl md:flex-row xl:p-10">
          <div className="mb-6">
            <h1 className="text-main font-[poppins] text-5xl font-black saturate-200 lg:text-7xl dark:brightness-125">
              Scordo
            </h1>
            <h3 className="mb-2 font-[cal_sans] text-2xl font-semibold tracking-wide text-wrap text-gray-800 dark:text-gray-50">
              Cricket
              <span className="text-main dark:text-main mx-2">Tournament</span>
              Manager
            </h3>
            <p className="mx-auto mb-6 max-w-lg text-sm font-semibold text-gray-700 sm:text-xl md:mx-0 dark:text-gray-300">
              Stay connected while organizing tournaments. Create and manage your own cricket teams
              and tournaments. Also check your teams performances.
            </p>
            <Button
              variant={"default"}
              className="center bg-main text-accent hover:bg-hover mx-auto h-full transform rounded-full border-none shadow-lg transition-all duration-300 hover:scale-105 md:mx-0"
            >
              <Link
                href={"/auth/sign-in"}
                className="center flex py-2 text-xl font-semibold text-gray-50"
              >
                <PlayCircle className="mr-2 h-6 w-6" /> Explore Scordo
              </Link>
            </Button>
          </div>
          <div className="relative flex items-center justify-center md:w-1/2">
            {/* Placeholder for a cricket-related visual (e.g., a stylized bat or ball) */}
            <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full opacity-30 blur-3xl sm:h-64 sm:w-64 md:opacity-40"></div>
            <img
              src={"/hero.png"}
              alt="Cricket hero"
              className="relative z-10 ml-6 h-auto w-full max-w-xs rotate-3 transform rounded-xl transition-transform duration-500 hover:rotate-0 md:max-w-sm xl:max-w-md"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-10">
          <h3 className="mb-6 flex items-center text-3xl font-bold text-gray-800 dark:text-gray-100">
            <Trophy className="text-main mr-2 h-8 w-8 contrast-50 saturate-200" /> Key Features
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="transform rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md transition-transform duration-300 hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
              <Users className="text-main mx-auto mb-4 h-12 w-12 contrast-50 saturate-200" />
              <h4 className="text-accent-foreground mb-2 text-xl font-bold">Teams & Players</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Dive deep into team profiles and player statistics.
              </p>
            </div>
            <div className="transform rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md transition-transform duration-300 hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
              <BarChart2 className="text-main mx-auto mb-4 h-12 w-12 contrast-50 saturate-200" />
              <h4 className="text-accent-foreground mb-2 text-xl font-bold">Detailed Stats</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Access comprehensive stats for every match and player.
              </p>
            </div>
            <div className="transform rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md transition-transform duration-300 hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
              <Trophy className="text-main mx-auto mb-4 h-12 w-12 contrast-50 saturate-200" />
              <h4 className="text-accent-foreground mb-2 text-xl font-bold">Tournament Info</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Get schedules, standings, and results for all tournaments.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-main dark:bg-main/80 transform rounded-2xl p-8 text-center text-white shadow-lg transition-transform duration-300 hover:scale-105 md:p-12">
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Catch the Action?</h3>
          <p className="mb-6 text-lg md:text-xl">
            Join Scordo today and never miss a moment of your favorite cricket matches!
          </p>
          <Link
            href={"/auth/sign-up"}
            className="mx-auto transform rounded-full border-none bg-white px-10 py-3 font-semibold text-green-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:text-emerald-900"
          >
            Sign Up Now
          </Link>
        </section>
      </div>
    </div>
  );
};

export default MarketingPage;
