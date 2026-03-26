import { Carousel } from "@/components/carousel";
import { Tournament } from "@/generated/prisma";
import { Activity, Gavel, Globe, LayoutGrid, PlusCircle, Search, Star } from "lucide-react";
import TournamentCard from "../_components/TournamentCard";
import { useState } from "react";

const TournamentsPage = () => {
  const primaryHeading =
    "bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic";
  // Mock Data
  const tournaments = [
    {
      id: "tr1",
      title: "Global Ashes 2026",
      details: {
        season: 4,
        maxTeams: 16,
        matchesPerTeam: 5,
        totalOvers: 20,
        minAge: 18,
        maxAge: null,
        winnerPrice: 15000,
        runnerUpPrice: 7500,
        entryFee: 1000,
        halfBoundary: false,
        location: { city: "London", state: "UK", country: "England" },
      },
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-07-01"),
    },
    {
      id: "tr2",
      title: "Neon Strike Invitational",
      details: {
        season: null,
        maxTeams: 8,
        matchesPerTeam: 3,
        totalOvers: 10,
        minAge: 16,
        maxAge: null,
        winnerPrice: 5000,
        runnerUpPrice: 2500,
        entryFee: 500,
        halfBoundary: true,
        location: { city: "Singapore", state: "SG", country: "" },
      },
      startDate: new Date("2026-04-15"),
      endDate: new Date("2026-04-20"),
    },
  ];

  return (
    <div className="animate-in fade-in min-h-screen bg-slate-50 p-4 duration-700 md:p-8 dark:bg-[#020617]">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header Section */}
        <header className="flex flex-col items-end justify-between gap-6 border-b border-slate-200 pb-10 md:flex-row dark:border-white/5">
          <div>
            <h2 className="mb-2 text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase">
              Regional Circuits
            </h2>
            <h1 className="text-5xl leading-none font-black tracking-tighter text-slate-900 uppercase italic md:text-7xl dark:text-white">
              Tournament <span className="text-emerald-500">Hub</span>
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Feed (8 Columns) */}
          <div className="space-y-16 lg:col-span-8">
            {/* Managed Section */}
            <section className="relative overflow-hidden rounded-[3.5rem] border border-slate-100 bg-white p-8 shadow-sm md:p-10 dark:border-white/5 dark:bg-white/5">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <LayoutGrid size={200} />
              </div>
              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-3 px-4">
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                    <Gavel size={22} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                    Managed <span className={primaryHeading}>By You</span>
                  </h3>
                  <div className="ml-4 h-px flex-1 bg-slate-100 dark:bg-white/5" />
                </div>

                {tournaments.length > 0 ? (
                  <Carousel>
                    {tournaments.map((t) => (
                      <TournamentCard key={t.id} tournament={t} />
                    ))}
                  </Carousel>
                ) : (
                  <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-20 text-center dark:border-white/5">
                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
                      No active management protocols
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Discovery Section */}
            <section className="relative overflow-hidden rounded-[3.5rem] border border-slate-100 bg-white p-8 shadow-sm md:p-10 dark:border-white/5 dark:bg-white/5">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Search size={200} />
              </div>
              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-3 px-4">
                  <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                    <Globe size={22} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                    Discover <span className={primaryHeading}>Active Leagues</span>
                  </h3>
                  <div className="ml-4 h-px flex-1 bg-slate-100 dark:bg-white/5" />
                </div>
                <Carousel>
                  {tournaments.map((t) => (
                    <TournamentCard key={`d-${t.id}`} tournament={t} />
                  ))}
                </Carousel>
              </div>
            </section>
          </div>

          {/* Sidebar (4 Columns) */}
          <aside className="space-y-8 lg:col-span-4">
            <div className="group relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 text-white shadow-2xl">
              <Activity size={24} className="mb-6 text-emerald-400" />
              <h4 className="mb-2 text-xl font-black tracking-tighter uppercase italic">
                Network Status
              </h4>
              <p className="mb-8 text-xs leading-relaxed font-medium text-slate-400 opacity-80">
                Scordo Global Infrastructure currently processing 142 concurrent leagues.
              </p>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Node Sync
                  </span>
                  <span className="text-sm font-black text-emerald-400">98.4%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "98%" }} />
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
                  <Star size={18} />
                </div>
                <h3 className="text-sm font-black tracking-widest uppercase">Hall of Fame</h3>
              </div>
              <div className="space-y-6">
                {[
                  { name: "Neon Knights", wins: 12, rating: "2440" },
                  { name: "Apex Sentinels", wins: 9, rating: "2210" },
                ].map((team, i) => (
                  <div key={i} className="group flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-xs font-black text-slate-400 transition-colors group-hover:text-indigo-500 dark:bg-white/5">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black tracking-tight text-slate-900 uppercase dark:text-white">
                        {String(team.name)}
                      </p>
                      <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        {String(team.wins)} Trophies
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-indigo-500">{String(team.rating)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;
