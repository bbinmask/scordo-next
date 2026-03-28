"use client";

import { notFound, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Tournament, Match, Team } from "@/generated/prisma";
import { DefaultLoader } from "@/components/Spinner";
import { BentoCard } from "../../_components/cards/bento-card";
import { StatBox } from "../../_components/cards/StatBox";
import {
  Trophy,
  Calendar,
  Users,
  ArrowUpRight,
  MapPin,
  Activity,
  Target,
  Wind,
  Flame,
  ChevronRight,
  Medal,
  Star,
  Zap,
  BarChart3,
  ShieldCheck,
  Hash,
} from "lucide-react";
import { formatDate } from "@/utils/helper/formatDate";
import {
  BestBowlingList,
  HighestScoresList,
  MostFoursList,
  MostRunsList,
  MostSixesList,
  MostWicketsList,
} from "../_components/LeaderboardLists";
import { MatchesList } from "../_components/MatchesList";
import { TournamentStats } from "../_components/TournamentStats";

// ── Types ────────────────────────────────────────────────────────────────────

interface TournamentDetail extends Tournament {
  organizer: { id: string; name: string; username: string; avatar: string | null };
  participatingTeams: {
    team: {
      id: string;
      name: string;
      abbreviation: string;
      logo: string | null;
      _count: { players: number };
    };
  }[];
  matches: (Match & {
    teamA: { id: string; name: string; abbreviation: string; logo: string | null };
    teamB: { id: string; name: string; abbreviation: string; logo: string | null };
  })[];
  _count: { participatingTeams: number; matches: number };
}

interface BatEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  teamLogo: string | null;
  runs: number;
  sixes: number;
  fours: number;
  balls: number;
  innings: number;
  highScore: number;
  avg: string;
  sr: string;
  notOuts: number;
}

interface BowlEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  teamLogo: string | null;
  wickets: number;
  runs: number;
  overs: number;
  innings: number;
  bbi: string;
  econ: string;
  avg: string;
  maidens: number;
}

interface HighScoreEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  sr: string;
}

interface BestBowlEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  wickets: number;
  runs: number;
  overs: number;
  figure: string;
  econ: string;
}

interface Leaderboard {
  mostRuns: BatEntry[];
  mostWickets: BowlEntry[];
  mostSixes: BatEntry[];
  mostFours: BatEntry[];
  highestScores: HighScoreEntry[];
  bestBowling: BestBowlEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "stats", label: "Stats" },
  { id: "matches", label: "Matches" },
  { id: "most-runs", label: "Most Runs" },
  { id: "most-wickets", label: "Most Wickets" },
  { id: "most-sixes", label: "Most Sixes" },
  { id: "most-fours", label: "Most Fours" },
  { id: "highest-scores", label: "Highest Scores" },
  { id: "best-bowling", label: "Best Bowling" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const statusBadge = (start: Date, end: Date) => {
  const now = new Date();
  if (now < new Date(start))
    return { label: "Upcoming", cls: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
  if (now > new Date(end))
    return { label: "Ended", cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return { label: "Live", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
};

const Avatar = ({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name: string;
  size?: "sm" | "md";
}) => {
  const dim = size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs";
  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-200 font-black text-slate-500 dark:bg-slate-700`}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        name[0]?.toUpperCase()
      )}
    </div>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1)
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 font-[poppins] text-xs font-black text-white">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 font-[poppins] text-xs font-black text-white">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 font-[poppins] text-xs font-black text-white">
        3
      </span>
    );
  return (
    <span className="flex h-6 w-6 items-center justify-center font-[urbanist] text-xs font-black text-slate-400">
      {rank}
    </span>
  );
};

// ── Leaderboard row components ────────────────────────────────────────────────

const BatRow = ({
  entry,
  rank,
  statKey,
  statLabel,
}: {
  entry: BatEntry;
  rank: number;
  statKey: keyof BatEntry;
  statLabel: string;
}) => (
  <div
    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
  >
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="min-w-0 flex-1">
      <Link
        href={`/u/${entry.username}`}
        className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
      >
        {entry.name}
      </Link>
      <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
        {entry.teamAbbr}
      </p>
    </div>
    <div className="shrink-0 text-right">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">
        {entry[statKey] as string | number}
      </p>
      <p className="font-[urbanist] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        {statLabel}
      </p>
    </div>
    <div className="hidden shrink-0 text-right md:block">
      <p className="font-[urbanist] text-xs font-semibold text-slate-500">{entry.innings} inn</p>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400">SR {entry.sr}</p>
    </div>
  </div>
);

const BowlRow = ({ entry, rank }: { entry: BowlEntry; rank: number }) => (
  <div
    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
  >
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="min-w-0 flex-1">
      <Link
        href={`/u/${entry.username}`}
        className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
      >
        {entry.name}
      </Link>
      <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
        {entry.teamAbbr}
      </p>
    </div>
    <div className="shrink-0 text-right">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">
        {entry.wickets}
      </p>
      <p className="font-[urbanist] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        wkts
      </p>
    </div>
    <div className="hidden shrink-0 text-right md:block">
      <p className="font-[urbanist] text-xs font-semibold text-slate-500">BBI {entry.bbi}</p>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400">Econ {entry.econ}</p>
    </div>
  </div>
);

const HighScoreRow = ({ entry, rank }: { entry: HighScoreEntry; rank: number }) => (
  <div
    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
  >
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="min-w-0 flex-1">
      <Link
        href={`/u/${entry.username}`}
        className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
      >
        {entry.name}
      </Link>
      <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
        {entry.teamAbbr}
      </p>
    </div>
    <div className="shrink-0 text-right">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">
        {entry.runs}
        {!entry.isOut && <span className="text-green-500">*</span>}
      </p>
      <p className="font-[urbanist] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        {entry.balls}b · SR {entry.sr}
      </p>
    </div>
    <div className="hidden shrink-0 items-center gap-3 md:flex">
      <span className="font-[urbanist] text-xs font-semibold text-blue-500">{entry.fours}×4</span>
      <span className="font-[urbanist] text-xs font-semibold text-emerald-500">
        {entry.sixes}×6
      </span>
    </div>
  </div>
);

const BestBowlRow = ({ entry, rank }: { entry: BestBowlEntry; rank: number }) => (
  <div
    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
  >
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="min-w-0 flex-1">
      <Link
        href={`/u/${entry.username}`}
        className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
      >
        {entry.name}
      </Link>
      <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
        {entry.teamAbbr}
      </p>
    </div>
    <div className="shrink-0 text-right">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">
        {entry.figure}
      </p>
      <p className="font-[urbanist] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        figure
      </p>
    </div>
    <div className="hidden shrink-0 text-right md:block">
      <p className="font-[urbanist] text-xs font-semibold text-slate-500">{entry.overs} ov</p>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400">Econ {entry.econ}</p>
    </div>
  </div>
);

const EmptyLeaderboard = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
      <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-600" />
    </div>
    <p className="font-[urbanist] text-sm font-semibold text-slate-400">
      No {label} data yet. Play some matches!
    </p>
  </div>
);

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-1.5 last:border-0 dark:border-white/5">
      <span className="font-[urbanist] text-xs font-semibold tracking-widest text-slate-400 uppercase">
        {label}
      </span>
      <span
        className={`font-[urbanist] text-sm font-bold ${highlight ? "text-amber-500" : "text-slate-700 dark:text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("overview");

  let { data: tournament, isLoading } = useQuery<TournamentDetail>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tournaments/${id}`);
      if (!data.success) throw new Error("Not found");
      return data.data;
    },
  });

  const { data: leaderboard, isLoading: lbLoading } = useQuery<Leaderboard>({
    queryKey: ["tournament-leaderboard", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(`/api/tournaments/leaderboard?tournamentId=${id}`);
      if (!data.success) return null;
      return data.data;
    },
  });

  if (isLoading) return <DefaultLoader />;

  if (!tournament) return notFound();

  const badge = statusBadge(tournament.startDate, tournament.endDate);
  const details = tournament.details;
  const isLeaderboardTab = [
    "most-runs",
    "most-wickets",
    "most-sixes",
    "most-fours",
    "highest-scores",
    "best-bowling",
  ].includes(tab);

  return (
    <div className="min-h-screen bg-slate-100 pb-28 font-sans transition-colors dark:bg-[#020617]">
      {/* ── Hero ──────────────────────────────────────────────────────── */}

      <header className="relative h-[50vh] w-full overflow-hidden bg-slate-900 md:h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="relative z-10 mx-auto flex h-full flex-col justify-end px-6 pb-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="animate-in slide-in-from-left-6 space-y-4 duration-700">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-600 p-2.5 shadow-lg shadow-emerald-600/30">
                  <Trophy size={20} className="text-white" />
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] text-emerald-400 uppercase">
                  Season 0{String(tournament.details.season || 1)}
                </span>
              </div>
              <h1 className="text-4xl leading-none font-black tracking-tighter text-white uppercase italic md:text-6xl">
                {String(tournament.title.split(" ")[0])}
                <br />
                <span className="text-emerald-500">
                  {String(tournament.title.split(" ").slice(1).join(" "))}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-400" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    {String(tournament.details.location?.city)},{" "}
                    {String(tournament.details.location?.state)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-400" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    Starts {new Date(tournament.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="animate-in slide-in-from-right-6 flex gap-4 duration-700">
              <button className="rounded-3xl bg-emerald-600 px-8 py-4 text-xs font-black tracking-widest text-white uppercase shadow-2xl shadow-emerald-500/30 transition-all hover:bg-emerald-500 active:scale-95">
                Apply For Entry
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto space-y-6 px-4 pt-5 md:px-6">
        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 font-[urbanist] text-xs font-semibold text-slate-400">
          <Link href="/tournaments" className="transition-colors hover:text-green-500">
            Tournaments
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-slate-600 dark:text-slate-300">{tournament.title}</span>
        </div>

        {/* ── Quick stat strip ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatBox
            label="Teams"
            value={tournament._count.participatingTeams}
            icon={Users}
            color="emerald"
            subLabel={`of ${details.maxTeams}`}
          />
          <StatBox
            label="Matches"
            value={tournament._count.matches}
            icon={Activity}
            color="emerald"
          />
          <StatBox label="Total Overs" value={details.totalOvers} icon={Hash} color="emerald" />
          <StatBox
            label="Entry Fee"
            value={details.entryFee ? `₹${details.entryFee}` : "Free"}
            icon={Trophy}
            color="emerald"
          />
        </div>

        {/* ── Scrollable tab bar ──────────────────────────────────────── */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl bg-slate-200/60 p-1 dark:bg-white/5">
          {TABS.map(({ id: tid, label }) => (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={`shrink-0 rounded-xl px-4 py-2 font-[urbanist] text-xs font-bold whitespace-nowrap transition-all ${
                tab === tid
                  ? "bg-white text-green-600 shadow dark:bg-green-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab panels ──────────────────────────────────────────────── */}

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-6">
            {tournament.description && (
              <BentoCard title="About" icon={Trophy}>
                <p className="font-[urbanist] text-sm leading-relaxed font-semibold text-slate-600 dark:text-slate-300">
                  {tournament.description}
                </p>
              </BentoCard>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <BentoCard title="Schedule" icon={Calendar}>
                <InfoRow label="Start Date" value={formatDate(new Date(tournament.startDate))} />
                <InfoRow label="End Date" value={formatDate(new Date(tournament.endDate))} />
                <InfoRow label="Matches / Team" value={String(details.matchesPerTeam)} />
                {details.minAge && (
                  <InfoRow
                    label="Age Limit"
                    value={`${details.minAge}–${details.maxAge ?? "∞"} yrs`}
                  />
                )}
              </BentoCard>

              <BentoCard title="Prizes & Fees" icon={Medal}>
                {details.winnerPrice != null && (
                  <InfoRow label="Winner Prize" value={`₹${details.winnerPrice}`} highlight />
                )}
                {details.runnerUpPrice != null && (
                  <InfoRow label="Runner-up" value={`₹${details.runnerUpPrice}`} />
                )}
                <InfoRow
                  label="Entry Fee"
                  value={details.entryFee ? `₹${details.entryFee}` : "Free"}
                />
                <InfoRow
                  label="Half Boundary"
                  value={details.halfBoundary ? "Enabled" : "Disabled"}
                />
              </BentoCard>
            </div>

            {(details.location || tournament.rules.length > 0) && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {details.location && (
                  <BentoCard title="Location" icon={MapPin}>
                    <p className="font-[poppins] text-base font-black text-slate-800 dark:text-white">
                      {details.location.city}, {details.location.state}
                    </p>
                    <p className="mt-1 font-[urbanist] text-sm font-semibold text-slate-400">
                      {details.location.country}
                    </p>
                  </BentoCard>
                )}
                {tournament.rules.length > 0 && (
                  <BentoCard title="Rules" icon={ShieldCheck}>
                    <ul className="space-y-2">
                      {tournament.rules.map((rule, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 font-[urbanist] text-sm font-semibold text-slate-600 dark:text-slate-300"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </BentoCard>
                )}
              </div>
            )}

            {/* Participating teams */}
            <BentoCard
              title={`Participating Teams (${tournament.participatingTeams.length})`}
              icon={Users}
            >
              {tournament.participatingTeams.length === 0 ? (
                <p className="font-[urbanist] text-sm font-semibold text-slate-400">
                  No teams registered yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {tournament.participatingTeams.map(({ team }) => (
                    <Link key={team.id} href={`/teams/${team.abbreviation}`}>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-green-200 hover:bg-green-50 dark:border-white/5 dark:bg-white/5 dark:hover:bg-green-500/10">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow dark:bg-slate-800">
                          {team.logo ? (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-[poppins] text-[10px] font-black text-slate-500">
                              {team.abbreviation.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-[poppins] text-xs font-black text-slate-800 dark:text-white">
                            {team.abbreviation}
                          </p>
                          <p className="font-[urbanist] text-[10px] font-semibold text-slate-400">
                            {team._count.players} players
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </BentoCard>
          </div>
        )}

        {/* STATS */}
        {tab === "stats" && (
          <div className="hover-card overflow-hidden rounded-[2rem] border border-slate-200 p-8 dark:border-white/10 dark:bg-slate-900/30">
            <TournamentStats
              matches={tournament.matches as any}
              leaderboard={leaderboard ?? null}
            />
          </div>
        )}

        {/* MATCHES */}
        {tab === "matches" && (
          <div className="hover-card overflow-hidden rounded-[2rem] border border-slate-200 p-6 dark:border-white/10 dark:bg-slate-900/30">
            <MatchesList matches={tournament.matches as any} />
          </div>
        )}

        {/* LEADERBOARD TABS */}
        {isLeaderboardTab && (
          <div className="hover-card overflow-hidden rounded-[2rem] border border-slate-200 p-6 dark:border-white/10 dark:bg-slate-900/30">
            {lbLoading ? (
              <div className="flex h-48 items-center justify-center">
                <BarChart3 className="h-8 w-8 animate-pulse text-green-500" />
              </div>
            ) : !leaderboard ? (
              <p className="py-16 text-center font-[urbanist] text-sm font-semibold text-slate-400">
                No data yet — play some matches!
              </p>
            ) : (
              <>
                {tab === "most-runs" && <MostRunsList data={leaderboard.mostRuns} />}
                {tab === "most-wickets" && <MostWicketsList data={leaderboard.mostWickets} />}
                {tab === "most-sixes" && <MostSixesList data={leaderboard.mostSixes} />}
                {tab === "most-fours" && <MostFoursList data={leaderboard.mostFours} />}
                {tab === "highest-scores" && <HighestScoresList data={leaderboard.highestScores} />}
                {tab === "best-bowling" && <BestBowlingList data={leaderboard.bestBowling} />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
