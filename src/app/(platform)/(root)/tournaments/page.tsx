import { Carousel } from "@/components/carousel";
import { Gavel, Globe, LayoutGrid, PlusCircle, Search, Star, Trophy } from "lucide-react";
import TournamentCard from "../_components/TournamentCard";
import Link from "next/link";
import { TournamentWithDetails } from "@/lib/types";
import Spinner from "@/components/Spinner";
import { EmptyCard } from "../matches/_components/cards/EmptyCard";

const TournamentsPage = () => {
  const tournaments: TournamentWithDetails[] = [
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
      matches: [],
      requests: [],
      banner:
        "https://res.cloudinary.com/dxfq3iotg/image/upload/v1565955916/Screen_Shot_2019-08-15_at_11.45.16_AM.png",
      description: "The Global",
      organizerId: "org1",
      rules: [],
      uniqueTitle: "global-ashes-2026",
      participatingTeams: [],
      tournamentOfficials: [],
      _count: { participatingTeams: 0 },
      status: "NOT_STARTED",
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
      rules: [],
      description: "A fast-paced T10 tournament featuring top teams from Asia.",
      banner:
        "https://res.cloudinary.com/dxfq3iotg/image/upload/v1565955916/Screen_Shot_2019-08-15_at_11.45.16_AM.png",
      organizerId: "org2",
      uniqueTitle: "neon-strike-invitational",
      startDate: new Date("2026-04-15"),
      endDate: new Date("2026-04-20"),
      matches: [],
      requests: [],
      participatingTeams: [],
      tournamentOfficials: [],
      _count: { participatingTeams: 5 },
      status: "NOT_STARTED",
    },
  ];

  const isLoading1 = false;
  const isLoading2 = false;

  return (
    <div className="animate-in fade-in min-h-screen p-4 duration-700 md:p-8">
      <div className="mx-auto space-y-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Feed (8 Columns) */}
          <div className="space-y-16 lg:col-span-8">
            {/* Managed Section */}
            <section className="relative overflow-hidden rounded-[3.5rem] border border-slate-100 bg-white p-8 shadow-sm md:p-10 dark:border-white/5 dark:bg-white/5">
              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-3 px-4">
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                    <Gavel size={22} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                    Managed <span className={"primary-heading pr-2"}>By You</span>
                  </h3>
                  <div className="ml-4 h-px flex-1 bg-slate-100 dark:bg-white/5" />
                </div>

                {isLoading1 ? (
                  <div className="flex h-52 items-center justify-center">
                    <Spinner className="" />
                  </div>
                ) : tournaments.length > 0 ? (
                  <Carousel>
                    {tournaments.map((t) => (
                      <TournamentCard key={t.id} tournament={t} />
                    ))}
                  </Carousel>
                ) : (
                  <div className="px-6">
                    <EmptyCard
                      Icon={<Trophy size={24} />}
                      type="matches"
                      title="No matches found"
                      linkText="Create Tournament"
                      href="/tournaments/create"
                      description="You are not currently managing any tournaments. Create a new tournament."
                    />
                  </div>
                )}
                {isLoading2 ? (
                  <div className="flex h-52 items-center justify-center">
                    <Spinner className="" />
                  </div>
                ) : tournaments.length > 0 ? (
                  <Carousel>
                    {tournaments.map((t) => (
                      <TournamentCard key={t.id} tournament={t} />
                    ))}
                  </Carousel>
                ) : (
                  <EmptyCard
                    linkText="Explore"
                    href="/explore"
                    type="tournaments"
                    title="No tournament available to join"
                    description=" There are currently no active tournaments available for you to join. Please check back later or explore other sections of the platform."
                    Icon={<Star size={24} />}
                  />
                )}
              </div>
            </section>

            {/* Discovery Section */}
            <section className="relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-8 shadow-sm md:p-10 dark:border-white/5 dark:bg-white/5">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Search size={200} />
              </div>
              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-3 px-4">
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                    <Globe size={22} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                    Discover <span className={"primary-heading pr-2"}>Active Leagues</span>
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
              <h4 className="mb-2 text-xl font-black tracking-tighter uppercase italic">
                Requests
              </h4>
              <p className="mb-8 text-center text-xs leading-relaxed font-medium text-slate-400 opacity-80">
                No request found
              </p>
            </div>

            <div className="group relative h-52 overflow-hidden rounded-[3rem] bg-gradient-to-br from-green-600 to-teal-900 p-6 text-white shadow-2xl">
              <div className="flex items-center">
                <PlusCircle size={28} className="mr-3" />
                <h2 className="flex items-center text-2xl font-black tracking-tighter uppercase italic">
                  Create Tournament
                </h2>
              </div>
              <p className="font-inter mb-6 pl-10 text-sm font-medium text-green-100 opacity-80">
                Start your own tournament. Create a tournament from the ground up and recruit teams.
              </p>
              <Link
                href={"/tournaments/create"}
                className="ml-10 inline-block rounded-2xl bg-white px-6 py-3 font-[poppins] text-xs font-bold text-green-900 uppercase shadow-lg hover:bg-green-50"
              >
                GO
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;
