"use client";

interface ExplorePageProps {
  children?: React.ReactNode;
  searchParams?: {
    query?: string;
  };
}
import { debounce, replace } from "lodash";
import React, { useState, useMemo, ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sun,
  Moon,
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  Users,
  Trophy,
  LucideProps,
} from "lucide-react";
import AfterSearch from "./_components/AfterSearch";
import { Input } from "@/components/ui/input";
import { CarouselSpacing } from "../dashboard/_components/CarouselSpacing";
import TournamentCard from "../_components/TournamentCard";

const mockTournaments = [
  {
    id: "tour_01",
    title: "Bengaluru Champions League",
    location: "Bengaluru, India",
    dates: "Oct 15 - Nov 10, 2025",
    banner:
      "https://images.unsplash.com/photo-1599586120158-b6051b755e03?q=80&w=2070&auto=format&fit=crop",
    entryFee: "₹2500",
  },
  {
    id: "tour_02",
    title: "Mumbai Corporate T20",
    location: "Mumbai, India",
    dates: "Sep 30 - Oct 25, 2025",
    banner:
      "https://images.unsplash.com/photo-1558980394-a3528b1e4a19?q=80&w=2070&auto=format&fit=crop",
    entryFee: "₹5000",
  },
  {
    id: "tour_03",
    title: "Delhi Weekend Bash",
    location: "Delhi, India",
    dates: "Nov 01 - Nov 30, 2025",
    banner:
      "https://images.unsplash.com/photo-1629285483773-6701b24a9190?q=80&w=1974&auto=format&fit=crop",
    entryFee: "₹1500",
  },
];

const mockMatches = [
  {
    id: "match_01",
    status: "Live",
    teamA: {
      name: "Royal Challengers",
      shortName: "RCB",
      logo: "https://placehold.co/60x60/A62626/FFFFFF?text=RCB",
      score: "176/4",
      overs: "18.2",
    },
    teamB: {
      name: "Super Kings",
      shortName: "CSK",
      logo: "https://placehold.co/60x60/FDB913/000000?text=CSK",
      score: "175/7",
      overs: "20",
    },
    summary: "RCB needs 0 runs in 10 balls",
  },
  {
    id: "match_02",
    status: "Upcoming",
    teamA: {
      name: "Mumbai Indians",
      shortName: "MI",
      logo: "https://placehold.co/60x60/004B8D/FFFFFF?text=MI",
    },
    teamB: {
      name: "Knight Riders",
      shortName: "KKR",
      logo: "https://placehold.co/60x60/3A225D/FFFFFF?text=KKR",
    },
    summary: "Starts in 2h 15m",
  },
  {
    id: "match_03",
    status: "Completed",
    teamA: {
      name: "Lords of Leather",
      shortName: "LL",
      logo: "https://placehold.co/60x60/6F4E37/FFFFFF?text=LL",
    },
    teamB: {
      name: "Corporate Crushers",
      shortName: "CC",
      logo: "https://placehold.co/60x60/2E2D82/FFFFFF?text=CC",
    },
    summary: "CC won by 5 wickets",
  },
  {
    id: "match_04",
    status: "Upcoming",
    teamA: {
      name: "Sunrisers",
      shortName: "SRH",
      logo: "https://placehold.co/60x60/F26522/FFFFFF?text=SRH",
    },
    teamB: {
      name: "Delhi Capitals",
      shortName: "DC",
      logo: "https://placehold.co/60x60/00008B/FFFFFF?text=DC",
    },
    summary: "Tomorrow, 7:30 PM",
  },
];

const mockTeams = [
  {
    id: "team_01",
    name: "Bengaluru Blasters",
    location: "Bengaluru, India",
    logo: "https://placehold.co/100x100/A62626/FFFFFF?text=BB",
  },
  {
    id: "team_02",
    name: "Mumbai Mavericks",
    location: "Mumbai, India",
    logo: "https://placehold.co/100x100/004B8D/FFFFFF?text=MM",
  },
  {
    id: "team_03",
    name: "Delhi Daredevils",
    location: "Delhi, India",
    logo: "https://placehold.co/100x100/00008B/FFFFFF?text=DD",
  },
];

const mockPlayers = [
  {
    id: "player_01",
    name: "Rohan Sharma",
    role: "Batsman",
    team: "Bengaluru Blasters",
    avatar: "https://placehold.co/100x100/333/FFF?text=RS",
  },
  {
    id: "player_02",
    name: "Vikram Singh",
    role: "All-rounder",
    team: "Mumbai Mavericks",
    avatar: "https://placehold.co/100x100/555/FFF?text=VS",
  },
  {
    id: "player_03",
    name: "Anjali Mehta",
    role: "Bowler",
    team: "Delhi Daredevils",
    avatar: "https://placehold.co/100x100/777/FFF?text=AM",
  },
];

const PlayerCard = ({ player }: any) => (
  <div className="flex transform flex-col items-center rounded-xl border border-white/20 bg-white/30 p-4 text-center shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-white/10">
    <img
      src={player.avatar}
      alt={player.name}
      className="h-24 w-24 rounded-full border-4 border-yellow-500 object-cover"
    />
    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{player.name}</h3>
    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{player.role}</p>
    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{player.team}</p>
    <button className="mt-4 w-full rounded-full bg-green-500 px-4 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-green-600">
      View Profile
    </button>
  </div>
);

const TeamCard = ({ team }: any) => (
  <div className="flex transform flex-col items-center rounded-xl border border-white/20 bg-white/30 p-4 text-center shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-white/10">
    <img
      src={team.logo}
      alt={team.name}
      className="h-24 w-24 rounded-full border-4 border-yellow-500 object-cover"
    />
    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{team.name}</h3>
    <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
      <MapPin className="mr-1 h-4 w-4 text-yellow-500" />
      <span>{team.location}</span>
    </div>
    <button className="mt-4 w-full rounded-full bg-green-500 px-4 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-green-600">
      View Team
    </button>
  </div>
);

const filters = [
  { label: "All", icon: Search },
  { label: "Players", icon: Users },
  { label: "Teams", icon: Shield },
  { label: "Tournaments", icon: Trophy },
];

const ExplorePage = ({ searchParams }: ExplorePageProps) => {
  const sParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [query, setQuery] = useState(sParams.get("query") || "");
  const [activeFilter, setActiveFilter] = useState("All");

  const results = {
    users: [],
    teams: [],
    tournaments: [],
  };

  const filteredData = useMemo(() => {
    const lowercasedFilter = query.toLowerCase();

    const tournaments = mockTournaments.filter((t) =>
      t.title.toLowerCase().includes(lowercasedFilter)
    );
    const teams = mockTeams.filter((t) => t.name.toLowerCase().includes(lowercasedFilter));
    const players = mockPlayers.filter((p) => p.name.toLowerCase().includes(lowercasedFilter));

    return { tournaments, teams, players };
  }, [query]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const params = new URLSearchParams(sParams);

    if (!term) {
      setQuery("");
      params.delete("query");
    } else {
      setQuery(term);
      params.set("query", term);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="min-h-full rounded-xl font-sans transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative mx-auto">
        <div className="relative p-2">
          <Input
            onChange={handleChange}
            placeholder="Search..."
            className="rounded-full border border-gray-400 p-4 pr-12 font-[poppins] text-base ring-green-600 focus:ring-2 focus-visible:ring-2 lg:p-6 lg:text-lg"
          />
          <button className="absolute top-4 right-4">
            <Search size={20} />
          </button>
        </div>
        <div className="flex justify-center p-1">
          {filters.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`center flex w-full transform border-r px-2 py-2 font-[urbanist] text-nowrap transition-all duration-500 ease-in-out hover:opacity-80 md:px-5 ${activeFilter === label ? "bg-gradient-to-r from-emerald-700 to-green-900 px-4 font-semibold text-white" : "hover:bg-hover/60 bg-gray-50 text-green-800 hover:text-gray-50 dark:bg-gray-800 dark:text-lime-300 dark:hover:bg-emerald-700"}`}
            >
              <Icon className="mr-1 h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      {query.trim() === "" ? (
        <div className="mx-auto mt-2 max-w-7xl border p-4 md:p-8">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Live</h2>
            <CarouselSpacing matches={mockMatches} status="Live" />
          </section>

          {/* Filtered Content */}
          {(activeFilter === "All" || activeFilter === "Tournaments") &&
            filteredData.tournaments.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Tournaments Nearby
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredData.tournaments.map((tour) => (
                    <TournamentCard key={tour.id} tournament={tour} />
                  ))}
                </div>
              </section>
            )}

          {(activeFilter === "All" || activeFilter === "Teams") &&
            filteredData.teams.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Featured Teams
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredData.teams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </section>
            )}

          {(activeFilter === "All" || activeFilter === "Players") &&
            filteredData.players.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Top Players
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredData.players.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </section>
            )}
        </div>
      ) : (
        // <div></div>
        <AfterSearch results={results} query={query} clearSearch={clearSearch}></AfterSearch>
      )}
    </div>
  );
};

export default ExplorePage;
