"use client";

interface ExplorePageProps {}

import React, { useState, useMemo, ForwardRefExoticComponent, RefAttributes } from "react";
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

const TournamentCard = ({ tournament }: any) => (
  <div className="group transform overflow-hidden rounded-xl border border-white/20 bg-white/30 shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-white/10">
    <div className="relative">
      <img
        src={tournament.banner}
        alt={tournament.title}
        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <h3 className="absolute bottom-3 left-4 text-xl font-extrabold tracking-tight text-white">
        {tournament.title}
      </h3>
    </div>
    <div className="p-4">
      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
        <MapPin className="mr-2 h-4 w-4 text-yellow-500" />
        <span>{tournament.location}</span>
      </div>
      <div className="mt-1 flex items-center text-sm text-gray-700 dark:text-gray-300">
        <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
        <span>{tournament.dates}</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          Entry: {tournament.entryFee}
        </span>
        <button className="flex items-center text-sm font-bold text-gray-800 transition-colors hover:text-green-500 dark:text-white dark:hover:text-green-400">
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

const LiveMatchCard = ({ match }: any) => (
  <div className="flex w-80 flex-shrink-0 transform flex-col justify-between rounded-xl border border-white/20 bg-white/30 p-4 shadow-md backdrop-blur-lg transition-transform duration-300 hover:scale-105 dark:bg-white/10">
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-gray-600 dark:text-gray-300">M. Chinnaswamy Stadium</p>
        {match.status === "Live" && (
          <span className="flex animate-pulse items-center text-xs font-bold text-red-500">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></span>LIVE
          </span>
        )}
        {match.status === "Upcoming" && (
          <span className="text-xs font-bold text-blue-500">{match.summary}</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={match.teamA.logo} alt={match.teamA.name} className="h-10 w-10 rounded-full" />
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {match.teamA.shortName}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{match.teamA.score}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {match.teamA.overs ? `(${match.teamA.overs} ov)` : ""}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={match.teamB.logo} alt={match.teamB.name} className="h-10 w-10 rounded-full" />
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {match.teamB.shortName}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{match.teamB.score}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {match.teamB.overs ? `(${match.teamB.overs} ov)` : ""}
          </p>
        </div>
      </div>
    </div>
    <div className="mt-3 border-t border-white/20 pt-3 text-center">
      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
        {match.status !== "Upcoming" ? match.summary : "Match yet to begin"}
      </p>
    </div>
  </div>
);

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

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="flex h-[40rem] flex-col items-center justify-center px-4">
      <h2 className="mb-10 text-center text-xl text-black sm:mb-20 sm:text-5xl dark:text-white">
        Ask Aceternity UI Anything
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

const ExplorePage = ({}: ExplorePageProps) => {
  const [theme, setTheme] = useState("dark");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const results = {
    users: [],
    teams: [],
    tournaments: [],
  };

  const FilterButton = ({
    label,
    icon: Icon,
  }: {
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  }) => (
    <button
      onClick={() => setActiveFilter(label)}
      className={`flex items-center space-x-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-md transition-all duration-300 ${activeFilter === label ? "border-transparent bg-green-500 text-white shadow-lg" : "border-white/20 bg-white/30 text-gray-800 hover:bg-white/50 dark:bg-black/20 dark:text-gray-100 dark:hover:bg-black/40"}`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  const filteredData = useMemo(() => {
    const lowercasedFilter = query.toLowerCase();

    const tournaments = mockTournaments.filter((t) =>
      t.title.toLowerCase().includes(lowercasedFilter)
    );
    const teams = mockTeams.filter((t) => t.name.toLowerCase().includes(lowercasedFilter));
    const players = mockPlayers.filter((p) => p.name.toLowerCase().includes(lowercasedFilter));

    return { tournaments, teams, players };
  }, [query]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="min-h-full rounded-xl font-sans transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative mx-auto">
        <div className="mt-4 flex justify-center space-x-2 md:space-x-4">
          <FilterButton label="All" icon={Search} />
          <FilterButton label="Players" icon={Users} />
          <FilterButton label="Teams" icon={Shield} />
          <FilterButton label="Tournaments" icon={Trophy} />
        </div>
        <div className="relative">
          <PlaceholdersAndVanishInput
            icon={Search}
            onSubmit={() => {}}
            placeholders={[
              "Search for teams",
              "Search for players",
              "Search for tournaments",
              "Search for matches",
            ]}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full p-4 pl-12 text-lg outline-none placeholder:pl-12 focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-300" />
        </div>
      </div>
      {query.trim() === "" ? (
        // <div className="mx-auto -mt-10 max-w-7xl p-4 md:p-8">
        //   {/* Live & Upcoming Matches Carousel */}
        //   <section className="mb-12">
        //     <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        //       Live & Upcoming
        //     </h2>
        //     <div className="scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent -mx-4 flex space-x-6 overflow-x-auto px-4 pb-4">
        //       {mockMatches
        //         .filter((m) => m.status !== "Completed")
        //         .map((match) => (
        //           <LiveMatchCard key={match.id} match={match} />
        //         ))}
        //     </div>
        //   </section>

        //   {/* Filtered Content */}
        //   {(activeFilter === "All" || activeFilter === "Tournaments") &&
        //     filteredData.tournaments.length > 0 && (
        //       <section className="mb-12">
        //         <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        //           Tournaments Nearby
        //         </h2>
        //         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        //           {filteredData.tournaments.map((tour) => (
        //             <TournamentCard key={tour.id} tournament={tour} />
        //           ))}
        //         </div>
        //       </section>
        //     )}

        //   {(activeFilter === "All" || activeFilter === "Teams") &&
        //     filteredData.teams.length > 0 && (
        //       <section className="mb-12">
        //         <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        //           Featured Teams
        //         </h2>
        //         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        //           {filteredData.teams.map((team) => (
        //             <TeamCard key={team.id} team={team} />
        //           ))}
        //         </div>
        //       </section>
        //     )}

        //   {(activeFilter === "All" || activeFilter === "Players") &&
        //     filteredData.players.length > 0 && (
        //       <section className="mb-12">
        //         <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        //           Top Players
        //         </h2>
        //         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        //           {filteredData.players.map((player) => (
        //             <PlayerCard key={player.id} player={player} />
        //           ))}
        //         </div>
        //       </section>
        //     )}
        // </div>
        <div></div>
      ) : (
        <AfterSearch results={results} query={query} clearSearch={clearSearch}></AfterSearch>
      )}
    </div>
  );
};

export default ExplorePage;
