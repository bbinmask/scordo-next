"use client";

interface ExplorePageProps {
  children?: React.ReactNode;
  searchParams?: {
    query: string;
  };
}
import { debounce, replace } from "lodash";
import React, { useState, useMemo, ChangeEvent, useRef } from "react";
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
import { useAction } from "@/hooks/useAction";
import { searchTeams, searchTournaments, searchUsers } from "@/actions/search-actions";

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
  { label: "Users", icon: Users },
  { label: "Teams", icon: Shield },
  { label: "Tournaments", icon: Trophy },
];

const ExplorePage = () => {
  const sParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState(sParams.get("query") || "");
  const [activeFilter, setActiveFilter] = useState<"all" | "users" | "teams" | "tournaments">(
    "all"
  );
  const [results, setResults] = useState<any>({
    users: [],
    teams: [],
    tournaments: [],
  });

  const { execute: searchUser } = useAction(searchUsers, {
    onSuccess: (data) => {
      setResults({ ...results, users: data });
    },
  });
  const { execute: searchTeam } = useAction(searchTeams, {
    onSuccess: (data) => {
      setResults({ ...results, teams: data });
    },
  });
  const { execute: searchTournament } = useAction(searchTournaments, {
    onSuccess: (data) => {
      setResults({ ...results, tournaments: data });
    },
  });

  const cache = useRef(new Map());

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        const params = new URLSearchParams(sParams);
        if (term) params.set("query", term);
        else params.delete("query");
        router.replace(`${pathname}?${params.toString()}`);

        // if (cache.current.has(term)) {
        //   setResults(cache.current.get(term));
        //   return;
        // }

        let res = { users: [], teams: [], tournaments: [] };

        if (term) {
          switch (activeFilter) {
            case "users":
              await searchUser({ q: term });
              break;
            case "teams":
              await searchTeam({ q: term });
              break;
            case "tournaments":
              await searchTournament({ q: term });
              break;
            default:
              await searchUser({ q: term });
              await searchTeam({ q: term });
              await searchTournament({ q: term });
          }
        }

        cache.current.set(term, res);
      }, 400),
    [router, pathname, activeFilter]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);
    debouncedSearch(term);
  };

  const clearSearch = () => {
    setQuery("");
    router.replace(pathname);
  };


  return (
    <div className="min-h-full rounded-xl font-sans transition-colors duration-500">
      <div className="relative mx-auto p-2">
        <div className="relative">
          <Input
            value={query}
            onChange={handleChange}
            placeholder="Search..."
            className="rounded-full border border-gray-400 p-4 pr-12 font-[poppins] text-base ring-green-600 focus:ring-2 lg:p-6 lg:text-lg"
          />
          <button onClick={() => debouncedSearch(query)} className="absolute top-4 right-4">
            <Search size={20} />
          </button>
        </div>

        <div className="flex justify-center p-1">
          {filters.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label.toLowerCase() as any)}
              className={`center flex w-full transform border-r px-2 py-2 transition-all ${
                activeFilter === label.toLowerCase()
                  ? "bg-green-700 text-white"
                  : "bg-gray-50 text-green-800 hover:bg-green-100"
              }`}
            >
              <Icon className="mr-1 h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {query.trim() === "" ? (
        <div className="mx-auto mt-2 max-w-7xl border p-4 md:p-8">
          <CarouselSpacing status="Live" matches={mockMatches} />
          {/* Your default home content */}
        </div>
      ) : (
        <AfterSearch results={results} query={query} clearSearch={clearSearch} />
      )}
    </div>
  );
};

export default ExplorePage;
