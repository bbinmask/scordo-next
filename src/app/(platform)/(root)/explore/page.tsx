"use client";

interface ExplorePageProps {
  children?: React.ReactNode;
  searchParams?: {
    query: string;
  };
}
import { debounce } from "lodash";
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
import { useAction } from "@/hooks/useAction";
import { searchTeams, searchTournaments, searchUsers } from "@/actions/search-actions";
import { useQuery } from "@tanstack/react-query";
import AxiosRequest from "@/utils/AxiosResponse";
import axios from "axios";
import { ViewTeamCard } from "../_components/ViewTeamCard";
import { TeamForListComponent } from "@/lib/types";

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
  const { isLoading: isUsersLoading } = useQuery({
    queryKey: ["search-users", query],
    queryFn: async () => {
      const res = await axios.get(`/api/search/users?query=${query}`);

      setResults((prev: any) => ({ ...prev, users: res.data }));

      return res.data;
    },
    enabled: query.trim().length > 0,
  });
  const { isLoading: isTeamsLoading } = useQuery({
    queryKey: ["search-teams", query],
    queryFn: async () => {
      const res = await axios.get(`/api/search/teams?query=${query}`);

      setResults((prev: any) => ({ ...prev, teams: res.data }));

      return res.data;
    },
    enabled: query.trim().length > 0,
  });
  const { isLoading: isTournamentsLoading } = useQuery({
    queryKey: ["search-tournaments", query],
    queryFn: async () => {
      const res = await axios.get(`/api/search/tournaments?query=${query}`);

      setResults((prev: any) => ({ ...prev, tournaments: res.data }));

      return res.data;
    },
    enabled: query.trim().length > 0,
  });

  const debouncedSetQuery = useMemo(() => debounce((value) => setQuery(value), 500), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    debouncedSetQuery(term);
  };

  const clearSearch = () => {
    setQuery("");
    router.replace(pathname);
  };

  const teams = [
    {
      id: "t1a93b51e23d4f87bca1",
      name: "Thunder Strikers",
      description: "A fast-paced cricket team known for their aggressive batting.",
      avatar: "https://i.pravatar.cc/150?img=11",
      owner: {
        id: "u1",
        name: "Irfanul Madar",
        username: "irfanulmadar",
      },
      _count: {
        players: 0,
      },
    },
    {
      id: "t2b84c62f34e5a98dcb2",
      name: "Royal Challengers",
      description: "Strong team with balanced players and fearless attitude.",
      avatar: "https://i.pravatar.cc/150?img=12",
      owner: {
        id: "u2",
        name: "Ayaan Khan",
        username: "ayaankhan",
      },
    },
    {
      id: "t3c75d73g45f6b09edc3",
      name: "Golden Warriors",
      description: "Focused on teamwork and precision bowling.",
      avatar: "https://i.pravatar.cc/150?img=13",
      owner: {
        id: "u3",
        name: "Rahul Sharma",
        username: "rahulsharma",
      },
    },
    {
      id: "t4d86e84h56g7c10fed4",
      name: "Crimson Hawks",
      description: "A team of young talents with unstoppable energy.",
      avatar: "https://i.pravatar.cc/150?img=14",
      owner: {
        id: "u4",
        name: "Adil Sheikh",
        username: "adilsheikh",
      },
    },
    {
      id: "t5e97f95i67h8d21gfe5",
      name: "Desert Kings",
      description: "Champions of the desert with dominating spin attack.",
      avatar: "https://i.pravatar.cc/150?img=15",
      owner: {
        id: "u5",
        name: "Mohammed Saif",
        username: "msaif",
      },
    },
    {
      id: "t6f08g06j78i9e32hgf6",
      name: "Urban Titans",
      description: "Smart strategies and consistent performance define this squad.",
      avatar: "https://i.pravatar.cc/150?img=16",
      owner: {
        id: "u6",
        name: "Rehan Ali",
        username: "rehanali",
      },
    },
    {
      id: "t7g19h17k89j0f43ihg7",
      name: "Storm Breakers",
      description: "Fast bowlers who rule the game with sheer pace.",
      avatar: "https://i.pravatar.cc/150?img=17",
      owner: {
        id: "u7",
        name: "Naveed Ansari",
        username: "naveedansari",
      },
    },
    {
      id: "t8h20i28l90k1g54jih8",
      name: "Blue Panthers",
      description: "Known for aggressive fielding and smart batting order.",
      avatar: "https://i.pravatar.cc/150?img=18",
      owner: {
        id: "u8",
        name: "Harish Mehta",
        username: "harishmehta",
      },
    },
    {
      id: "t9i31j39m01l2h65kji9",
      name: "Emerald Eagles",
      description: "Focused on discipline, patience, and consistent growth.",
      avatar: "https://i.pravatar.cc/150?img=19",
      owner: {
        id: "u9",
        name: "Shoaib Malik",
        username: "shoaibmalik",
      },
    },
    {
      id: "t10j42k40n12m3i76lkj0",
      name: "Shadow Wolves",
      description: "Silent but deadly — a team of unpredictable finishers.",
      avatar: "https://i.pravatar.cc/150?img=20",
      owner: {
        id: "u10",
        name: "Imran Qureshi",
        username: "imranqureshi",
      },
    },
  ];

  return (
    <div className="min-h-full rounded-xl font-sans transition-colors duration-500">
      <div className="relative mx-auto p-2">
        <div className="relative">
          <Input
            onChange={handleChange}
            placeholder="Search..."
            className="rounded-full border border-gray-400 p-4 pr-12 font-[poppins] text-base ring-green-600 focus:ring-2 lg:p-6 lg:text-lg"
          />
          <button disabled className="absolute top-2 right-2 lg:top-4 lg:right-4">
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

      <div className="grid grid-cols-3 gap-3">
        {teams.map((team) => (
          <ViewTeamCard team={team} key={team.id} />
        ))}
      </div>

      {query.trim() === "" ? (
        <div className="mx-auto mt-2 max-w-7xl border p-4 md:p-8">
          <CarouselSpacing status="Live" matches={mockMatches} />
          {/* Your default home content */}
        </div>
      ) : (
        <AfterSearch
          isLoading={isUsersLoading || isTeamsLoading || isTournamentsLoading}
          results={results}
          query={query}
          clearSearch={clearSearch}
        />
      )}
    </div>
  );
};

export default ExplorePage;
